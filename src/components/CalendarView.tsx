import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task, Group, LEVEL_COLORS } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  groups: Group[];
  onTaskUpdate: (task: Task) => void;
  onTaskComplete: (task: Task, isCompleted: boolean) => void;
  onTaskDelete: (taskId: string) => void;
}

const CalendarView = ({ tasks, groups, onTaskUpdate, onTaskComplete, onTaskDelete }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    return tasks.filter(task => {
      if (task.isCompleted) return false; // Hide completed tasks
      
      // Tasks with specific due dates
      if (task.dueDate) {
        const taskDueDate = new Date(task.dueDate).toISOString().split('T')[0];
        if (taskDueDate === dateString) return true;
      }
      
      // Today's tasks (tasks without due date that should show today)
      if (dateString === today && !task.dueDate) return true;
      
      // Recurring tasks - show on all specified repeat days
      if (task.repeatDays && task.repeatDays.length > 0) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[date.getDay()];
        
        // Handle daily repetition
        if (task.repeatDays.includes('daily')) return true;
        
        // Handle specific day repetition
        return task.repeatDays.includes(dayName);
      }
      
      return false;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <Button variant="outline" size="sm" onClick={goToNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const tasksForDate = getTasksForDate(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-600 rounded ${
                date ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {tasksForDate.map(task => (
                      <div
                        key={task.id}
                        className="text-xs p-2 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 border border-white/20 hover:scale-[1.02]"
                        style={{ 
                          backgroundColor: task.customColor || LEVEL_COLORS[task.level],
                          color: 'white'
                        }}
                        onClick={() => onTaskComplete(task, !task.isCompleted)}
                        title={`${task.name} (${task.level} - ${task.duration}min)`}
                      >
                        <div className="font-medium">
                          {task.name.length > 15 ? `${task.name.substring(0, 15)}...` : task.name}
                        </div>
                        <div className="text-xs opacity-90 mt-1 flex items-center justify-between">
                          <span>{task.duration}min</span>
                          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                            {task.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;