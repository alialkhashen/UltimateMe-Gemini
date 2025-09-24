// old Task's UI
import { useState, useEffect } from 'react';
import { Edit, Trash2, Play, Pause, Square, Clock, StickyNote, Trophy, Timer, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Task, Group, LEVEL_COLORS, TASK_REWARDS } from '@/types';
import TaskEditDialog from './TaskEditDialog';

interface TaskCardProps {
  task: Task;
  groups: Group[];
  onTaskUpdate: (task: Task) => void;
  onTaskComplete: (task: Task, isCompleted: boolean) => void;
  onTaskDelete: (taskId: string) => void;
  onPenalty?: (penaltyMinutes: number) => void;
  isAdminMode?: boolean;
}

const TaskCard = ({ task, groups, onTaskUpdate, onTaskComplete, onTaskDelete, onPenalty, isAdminMode = false }: TaskCardProps) => {
  const [isActive, setIsActive] = useState(task.isActive);
  const [timeRemaining, setTimeRemaining] = useState(task.timeRemaining);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Save timer state to localStorage when page becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        // Save current state to localStorage
        localStorage.setItem(`task-${task.id}-state`, JSON.stringify({
          isActive,
          timeRemaining,
          timestamp: Date.now()
        }));
      } else if (!document.hidden) {
        // Restore state from localStorage when page becomes visible
        const savedState = localStorage.getItem(`task-${task.id}-state`);
        if (savedState && isActive) {
          try {
            const { timeRemaining: savedTime, timestamp } = JSON.parse(savedState);
            const timePassed = Math.floor((Date.now() - timestamp) / 1000);
            const newTimeRemaining = Math.max(0, savedTime - timePassed);
            setTimeRemaining(newTimeRemaining);
            
            if (newTimeRemaining <= 0) {
              setIsActive(false);
              localStorage.removeItem(`task-${task.id}-state`);
            }
          } catch (error) {
            console.error('Error restoring timer state:', error);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, timeRemaining, task.id]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [editedNotes, setEditedNotes] = useState(task.notes || '');

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timer) return;
    
    setIsActive(true);
    const newTimer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          setTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const pauseTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsActive(false);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsActive(false);
    setTimeRemaining(task.duration * 60);
  };

  const handleCompleteToggle = (checked: boolean) => {
    // Stop any running timer first
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsActive(false);

    // Update last interaction date and complete in a single operation to avoid race conditions
    const today = new Date().toISOString().split('T')[0];
    const baseTask = { ...task, lastInteractionDate: today };
    
    // Override rewards for overdue tasks
    if (isOverdue() && checked) {
      const overdueReward = { points: 0, minutes: 5 };
      const modifiedTask = { 
        ...baseTask, 
        rewardPoints: overdueReward.points, 
        rewardTime: overdueReward.minutes 
      };
      onTaskComplete(modifiedTask, checked);
    } else {
      onTaskComplete(baseTask, checked);
    }
  };
  const handleNotesUpdate = () => {
    onTaskUpdate({ ...task, notes: editedNotes.trim() || undefined });
    setIsNotesDialogOpen(false);
  };

  const taskColor = task.customColor || LEVEL_COLORS[task.level];
  const barColor = task.customBarColor || taskColor;
  const progress = ((task.duration * 60 - timeRemaining) / (task.duration * 60)) * 100;

  const getRewardValues = () => {
    if (task.rewardPoints !== undefined && task.rewardPoints !== null && 
        task.rewardTime !== undefined && task.rewardTime !== null) {
      return { points: task.rewardPoints, minutes: task.rewardTime };
    }
    return TASK_REWARDS[task.level];
  };

  const rewards = getRewardValues();

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const endOfDueDate = new Date(dueDate);
    endOfDueDate.setHours(23, 59, 59, 999);
    return now > endOfDueDate && !task.isCompleted;
  };

  const getDueDateColor = () => {
    if (!task.dueDate) return 'text-gray-500';
    if (isOverdue()) return 'text-red-500';
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'text-orange-500';
    if (diffDays === 1) return 'text-yellow-500';
    return 'text-gray-500';
  };

  if (task.notes && !task.notes) {
    console.log('Task has notes property but value is undefined:', task);
  }

  return (
    <>
      <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 w-full max-w-sm sm:max-w-md">
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: taskColor }}
        />
        
        <CardContent className="p-3 sm:p-4 flex flex-col min-h-[200px]">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1 pr-2">
              <h3 className={`font-semibold text-gray-900 dark:text-white break-words ${
                task.isCompleted ? 'line-through opacity-60' : ''
              }`}>
                {task.name}
              </h3>
              <div className="h-1"></div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {task.notes && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  onClick={() => setIsNotesDialogOpen(true)}
                  title="View notes"
                >
                  <StickyNote className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                onClick={() => onTaskDelete(task.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: `${taskColor}20`, color: taskColor }}
                >
                  {task.level.toUpperCase()}
                </Badge>
              </div>

              {/* Reward Information */}
              <div className="flex items-center justify-between text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-md px-3 py-2">
                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                  <Trophy className="w-4 h-4" />
                  <span>{rewards.points} pts</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Timer className="w-4 h-4" />
                  <span>{rewards.minutes} min reward</span>
                </div>
              </div>

              {task.dueDate && (
                <div className={`text-sm ${getDueDateColor()}`}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                  {isOverdue() && <span className="ml-1 font-semibold">(Overdue)</span>}
                </div>
              )}

              {/* Days of the Week - Always visible */}
              <div className="flex flex-wrap gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const fullDayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index];
                  const isDailyRepeat = task.repeatDays?.includes('daily');
                  const isSpecificDaySelected = task.repeatDays?.includes(fullDayName);
                  const isHighlighted = isDailyRepeat || isSpecificDaySelected;
                  
                  return (
                    <span 
                      key={day}
                      className={`px-2 py-1 text-xs rounded ${
                        isHighlighted
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Buttons always at bottom */}
            {!task.isCompleted && (
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => handleCompleteToggle(true)}
                  className="flex-1 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                >
                  <Check className="w-6 h-6" strokeWidth={3} />
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => {
                    // Update last interaction date when user clicks penalty button
                    const today = new Date().toISOString().split('T')[0];
                    const updatedTask = { ...task, lastInteractionDate: today };
                    onTaskUpdate(updatedTask);
                    
                    const rewardValues = getRewardValues();
                    onPenalty?.(rewardValues.minutes);
                    // Don't complete the task, just apply penalty and remove it
                    onTaskDelete(task.id);
                  }}
                  className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                >
                  <X className="w-6 h-6" strokeWidth={3} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        task={task}
        groups={groups}
        onTaskUpdate={onTaskUpdate}
        isAdminMode={isAdminMode}
      />

      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Task Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="taskNotes" className="text-gray-700 dark:text-gray-300 mb-2 block">
                Notes
              </Label>
              <Textarea
                id="taskNotes"
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Add notes about this task..."
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleNotesUpdate} className="flex-1">
                Save Notes
              </Button>
              <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
