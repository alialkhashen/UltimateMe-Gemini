import { useState } from 'react';
import { Edit, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, Group, LEVEL_COLORS } from '@/types';
import ColorPanel from './ColorPanel';

interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  groups: Group[];
  onTaskUpdate: (task: Task) => void;
  isAdminMode?: boolean;
}

const TaskEditDialog = ({ isOpen, onClose, task, groups, onTaskUpdate, isAdminMode = false }: TaskEditDialogProps) => {
  const [editedTask, setEditedTask] = useState(task);
  const [isCustomLevel, setIsCustomLevel] = useState(task.rewardPoints !== undefined || task.rewardTime !== undefined);

  const weekDays = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ];

  const saveTask = () => {
    onTaskUpdate(editedTask);
    onClose();
  };

  const handleLevelChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomLevel(true);
      setEditedTask({ 
        ...editedTask, 
        level: 'mid',
        rewardPoints: editedTask.rewardPoints || 10,
        rewardTime: editedTask.rewardTime || 10
      });
    } else {
      setIsCustomLevel(false);
      setEditedTask({ 
        ...editedTask, 
        level: value as 'core' | 'hard' | 'mid' | 'easy',
        rewardPoints: undefined,
        rewardTime: undefined
      });
    }
  };

  const toggleRepeatDay = (day: string) => {
    if (day === 'daily') {
      // Toggle daily mode
      setEditedTask(prev => ({
        ...prev,
        repeatDays: prev.repeatDays?.includes('daily') 
          ? [] // Remove daily and allow individual day selection
          : ['daily'] // Set to daily only
      }));
    } else {
      // Toggle individual days (only if not in daily mode)
      setEditedTask(prev => {
        if (prev.repeatDays?.includes('daily')) return prev; // Don't allow changes in daily mode
        const currentDays = prev.repeatDays || [];
        return {
          ...prev,
          repeatDays: currentDays.includes(day) 
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day]
        };
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskName" className="text-gray-700 dark:text-gray-300">Task Name</Label>
            <Input
              id="taskName"
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="taskLevel" className="text-gray-700 dark:text-gray-300">Task Level</Label>
            <Select 
              value={isCustomLevel ? 'custom' : editedTask.level} 
              onValueChange={handleLevelChange}
            >
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectItem value="easy" className="text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.easy }} />
                    Easy (+2 points, 5 min)
                  </div>
                </SelectItem>
                <SelectItem value="mid" className="text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.mid }} />
                    Mid (+5 points, 10 min)
                  </div>
                </SelectItem>
                <SelectItem value="hard" className="text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.hard }} />
                    Hard (+10 points, 20 min)
                  </div>
                </SelectItem>
                <SelectItem value="core" className="text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.core }} />
                    Core (+25 points, 45 min)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>



          <div>
            <Label htmlFor="taskDueDate" className="text-gray-700 dark:text-gray-300">
              Schedule Task (Optional)
            </Label>
            <Input
              id="taskDueDate"
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave empty for immediate tasks, set date to schedule for later
            </p>
          </div>

          <div>
            <Label htmlFor="taskGroup" className="text-gray-700 dark:text-gray-300">Group</Label>
            <Select 
              value={editedTask.groupId} 
              onValueChange={(value) => setEditedTask({ ...editedTask, groupId: value })}
            >
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {groups.filter(g => !g.isDefault).map(group => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Repeat Days</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              <button
                type="button"
                onClick={() => toggleRepeatDay('daily')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  editedTask.repeatDays?.includes('daily')
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Daily
              </button>
              {weekDays.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleRepeatDay(day.id)}
                  disabled={editedTask.repeatDays?.includes('daily')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    editedTask.repeatDays?.includes(day.id)
                      ? 'bg-blue-500 text-white'
                      : editedTask.repeatDays?.includes('daily')
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select Daily for every day, or specific days for weekly repetition
            </p>
          </div>

          {isAdminMode && (
            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-gray-300">Task Card Color</Label>
              <ColorPanel
                selectedColor={editedTask.customColor}
                onColorChange={(color) => setEditedTask({ ...editedTask, customColor: color })}
                title="Select Task Card Color"
                defaultColor={LEVEL_COLORS[editedTask.level]}
              >
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Choose Color
                </Button>
              </ColorPanel>
            </div>
          )}


          <div className="flex gap-2 pt-4">
            <Button onClick={saveTask} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
