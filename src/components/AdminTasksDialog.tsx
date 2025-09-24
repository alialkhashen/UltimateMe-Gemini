import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Trash2 } from 'lucide-react';
import { Task, Group, LEVEL_COLORS } from '@/types';
import { formatDate, extractDatePart } from '@/utils/dateUtils';

interface AdminTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  groups: Group[];
  onTaskDelete: (taskId: string) => void;
}

const AdminTasksDialog = ({ open, onOpenChange, tasks, groups, onTaskDelete }: AdminTasksDialogProps) => {
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const getGroupName = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group?.name || 'Unknown Group';
  };

  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);
    try {
      await onTaskDelete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const getNextScheduledDate = (task: Task) => {
    if (!task.repeatDays || task.repeatDays.length === 0) {
      return task.dueDate ? extractDatePart(task.dueDate) : 'No schedule';
    }

    if (task.repeatDays.includes('daily')) {
      return 'Daily';
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const days = task.repeatDays.map(day => 
      dayNames[['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day)]
    ).filter(Boolean);

    return days.length > 0 ? days.join(', ') : 'Weekly';
  };

  // Get all tasks including scheduled ones from localStorage
  const getAllTasks = () => {
    const scheduledTasks = JSON.parse(localStorage.getItem('scheduledTasks') || '[]');
    const allTasks = [...tasks];
    
    // Add scheduled tasks that aren't created yet
    scheduledTasks.forEach((st: any) => {
      if (!st.created && !allTasks.find(t => t.name === st.task.name && t.groupId === st.task.groupId)) {
        allTasks.push({
          ...st.task,
          id: `scheduled_${st.key}`,
          isScheduled: true,
          dueDate: st.nextDate || st.targetDate,
          isCompleted: false,
          isActive: false
        });
      }
    });

    return allTasks.sort((a, b) => {
      // Sort by completion status first (incomplete first)
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      // Then by level priority
      const levelOrder = { core: 0, hard: 1, mid: 2, easy: 3 };
      return levelOrder[a.level] - levelOrder[b.level];
    });
  };

  const allTasks = getAllTasks();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>All Tasks Management</span>
            <Badge variant="secondary" className="ml-2">
              {allTasks.length} task{allTasks.length !== 1 ? 's' : ''}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3">
            {allTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tasks found in the system</p>
              </div>
            ) : (
              allTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 border rounded-lg bg-card ${
                    task.isCompleted ? 'opacity-60' : ''
                  } ${task.isScheduled ? 'border-dashed border-blue-300' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: LEVEL_COLORS[task.level] }}
                      />
                      <h4 className="font-medium text-foreground truncate">
                        {task.name}
                      </h4>
                      {task.isScheduled && (
                        <Badge variant="outline" className="text-xs">
                          ⏰ Scheduled
                        </Badge>
                      )}
                      {task.isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="bg-muted px-2 py-1 rounded text-xs">
                        {getGroupName(task.groupId)}
                      </span>
                      <span className="bg-muted px-2 py-1 rounded text-xs capitalize">
                        {task.level}
                      </span>
                      <span className="bg-muted px-2 py-1 rounded text-xs">
                        {task.duration}m
                      </span>
                      <span className="bg-muted px-2 py-1 rounded text-xs">
                        {getNextScheduledDate(task)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deletingTaskId === task.id}
                    className="ml-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingTaskId === task.id ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTasksDialog;