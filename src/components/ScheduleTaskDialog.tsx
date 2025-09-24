
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task, Group, LEVEL_COLORS } from '@/types';

interface ScheduleTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  onTaskCreate: (task: Task) => void;
}

const ScheduleTaskDialog = ({ isOpen, onClose, groups, onTaskCreate }: ScheduleTaskDialogProps) => {
  const [taskName, setTaskName] = useState('');
  const [taskLevel, setTaskLevel] = useState<'hard' | 'mid' | 'easy'>('mid');
  const [dueDate, setDueDate] = useState('');
  const [duration, setDuration] = useState(30);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [repeatDays, setRepeatDays] = useState<string[]>([]);

  const weekDays = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ];

  const handleSubmit = () => {
    if (!taskName.trim() || !dueDate) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: taskName.trim(),
      level: taskLevel,
      dueDate: dueDate,
      duration,
      repeatDays,
      groupId: selectedGroup || 'scheduled-tasks',
      isCompleted: false,
      isActive: false,
      timeRemaining: duration * 60,
      createdAt: new Date().toISOString()
    };

    onTaskCreate(newTask);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTaskName('');
    setTaskLevel('mid');
    setDueDate('');
    setDuration(30);
    setSelectedGroup('');
    setRepeatDays([]);
  };

  const toggleRepeatDay = (day: string) => {
    setRepeatDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
            />
          </div>

          <div>
            <Label htmlFor="taskLevel">Level</Label>
            <Select value={taskLevel} onValueChange={(value: any) => setTaskLevel(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.easy }} />
                    Easy (+2 points, 5 min)
                  </div>
                </SelectItem>
                <SelectItem value="mid">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.mid }} />
                    Mid (+5 points, 10 min)
                  </div>
                </SelectItem>
                <SelectItem value="hard">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.hard }} />
                    Hard (+10 points, 20 min)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
              min="1"
              max="480"
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="group">Group (Optional)</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group (optional)" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex items-center gap-2">
                      {group.icon && <span>{group.icon}</span>}
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                      {group.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Repeat Days</Label>
            <div className="flex gap-1 mt-2">
              {weekDays.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleRepeatDay(day.id)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    repeatDays.includes(day.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!taskName.trim() || !dueDate} className="flex-1">
              Schedule Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleTaskDialog;
