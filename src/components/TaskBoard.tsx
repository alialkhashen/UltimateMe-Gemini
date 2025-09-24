// taskboard
import { useState, useEffect } from 'react';
import { Plus, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskCard from '@/components/TaskCard';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import { Task, Group, UserStats, TASK_REWARDS } from '@/types';
import { getToday, extractDatePart } from '@/utils/dateUtils';

interface TaskBoardProps {
  tasks: Task[];
  activeGroupId: string;
  groups: Group[];
  onTaskCreate: (newTask: Omit<Task, 'id' | 'createdAt'>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onUserStatsChange: (updater: (prev: UserStats) => UserStats) => void;
  userStats: UserStats;
  onPenalty?: (penaltyMinutes: number) => void;
  isAdminMode?: boolean;
}

const TaskBoard = ({ 
  tasks, 
  activeGroupId, 
  groups, 
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onUserStatsChange,
  userStats,
  onPenalty,
  isAdminMode = false
}: TaskBoardProps) => {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [checkedOverdueTasks, setCheckedOverdueTasks] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'level' | 'name' | 'date'>('level');

  // This effect handles applying penalties for unfinished tasks from previous days.
  useEffect(() => {
    const today = getToday();
    const overdueTasks = tasks.filter(task => {
      if (task.isCompleted || checkedOverdueTasks.has(task.id)) return false;
      const taskDueDate = extractDatePart(task.dueDate);
      return taskDueDate < today;
    });

    if (overdueTasks.length > 0) {
      let totalPenalty = 0;
      const newCheckedIds = new Set(checkedOverdueTasks);
      
      overdueTasks.forEach(task => {
        const reward = TASK_REWARDS[task.level];
        totalPenalty += reward.minutes;
        newCheckedIds.add(task.id);
        onTaskUpdate(task.id, { lastInteractionDate: today });
      });

      if (totalPenalty > 0) {
        onUserStatsChange(prev => ({
          ...prev,
          rewardMinutes: prev.rewardMinutes - totalPenalty
        }));
        setCheckedOverdueTasks(newCheckedIds);
      }
    }
  }, [tasks, checkedOverdueTasks, onUserStatsChange, onTaskUpdate]);

  const handleTaskComplete = (task: Task, isCompleted: boolean) => {
    const today = getToday();
    onTaskUpdate(task.id, { isCompleted, lastInteractionDate: today });
    
    if (isCompleted) {
      const isOverdue = () => {
        if (!task.dueDate) return false;
        const now = new Date();
        const endOfDueDate = new Date(task.dueDate);
        endOfDueDate.setHours(23, 59, 59, 999);
        return now > endOfDueDate;
      };

      // ✅ FIX: All reward logic, including for overdue tasks, is now handled here.
      let rewards = TASK_REWARDS[task.level]; // Default rewards
      if (isOverdue()) {
        rewards = { points: 0, minutes: 5 }; // Special reward for completing an overdue task
      } else if (task.rewardPoints !== undefined && task.rewardTime !== undefined) {
        rewards = { points: task.rewardPoints, minutes: task.rewardTime }; // Custom rewards set on the task
      }
      
      onUserStatsChange(prev => ({
        ...prev,
        points: prev.points + rewards.points,
        rewardMinutes: prev.rewardMinutes + rewards.minutes,
        completedTasks: prev.completedTasks + 1
      }));
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
        if (!activeGroupId || activeGroupId === 'all-tasks') {
            return !task.isCompleted;
        }
        if (activeGroupId === 'completed-tasks') {
            return task.isCompleted;
        }
        return task.groupId === activeGroupId && !task.isCompleted;
    });
  };

  const sortedTasks = [...getFilteredTasks()].sort((a, b) => {
    switch (sortBy) {        
        case 'level':
          const levelOrder: { [key: string]: number } = { core: 0, hard: 1, mid: 2, easy: 3 };
          return levelOrder[a.level] - levelOrder[b.level];
        
        case 'name':
          return a.name.localeCompare(b.name);
        
        case 'date':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        
        default:
          return 0;
      }
  });
  
  const activeGroup = groups.find(g => g.id === activeGroupId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {activeGroup?.name || 'All Tasks'}
        </h2>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[120px] bg-white dark:bg-gray-700">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="level">Level</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Due Date</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreatingTask(true)} disabled={!activeGroupId || activeGroup?.isDefault}>
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No tasks in this group. Add one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                groups={groups}
                // ✅ FIX: This prop is now passed correctly to match the TaskCard's needs.
                onTaskUpdate={(updates) => onTaskUpdate(task.id, updates)}
                onTaskComplete={handleTaskComplete}
                onTaskDelete={onTaskDelete}
                onPenalty={onPenalty}
                isAdminMode={isAdminMode}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTaskDialog
        isOpen={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
        groups={groups.filter(g => !g.isDefault)}
        onTaskCreate={(newTask) => {
          onTaskCreate(newTask);
          onUserStatsChange(prev => ({ ...prev, totalTasks: prev.totalTasks + 1 }));
        }}
        isAdminMode={isAdminMode}
        activeGroupId={activeGroupId}
      />
    </div>
  );
};

export default TaskBoard;