import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, Group, LEVEL_COLORS } from '@/types';
import { getToday, formatDate, extractDatePart, isSameDate } from '@/utils/dateUtils';

interface CalendarPageProps {
  tasks: Task[];
  groups: Group[];
  onTaskComplete: (task: Task, isCompleted: boolean) => void;
  onBackToTasks: () => void;
}

const CalendarPage = ({ tasks, groups, onTaskComplete, onBackToTasks }: CalendarPageProps) => {
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
    
    const dateString = formatDate(date);
    const today = getToday();
    
    console.log('Getting tasks for calendar date:', dateString, 'today:', today);
    
    const filteredTasks = tasks.filter(task => {
      // Only show tasks with specific due dates that match this date
      if (task.dueDate) {
        const taskDueDate = extractDatePart(task.dueDate);
        console.log('Calendar task:', task.name, 'dueDate:', task.dueDate, 'extracted:', taskDueDate, 'checking against:', dateString, 'matches:', taskDueDate === dateString);
        return taskDueDate === dateString;
      }
      
      // Today's tasks (tasks without due date that should show today only)
      if (dateString === today && !task.dueDate) return true;
      
      return false;
    });
    
    // Also show scheduled tasks for this date
    const scheduledTasks = JSON.parse(localStorage.getItem('scheduledTasks') || '[]');
    const scheduledForDate = scheduledTasks.filter((st: any) => 
      st.nextDate === dateString && !st.created
    );
    
    // Add preview of scheduled tasks
    scheduledForDate.forEach((st: any) => {
      filteredTasks.push({
        ...st.task,
        id: `scheduled-${st.key}`,
        dueDate: dateString,
        isScheduled: true, // Mark as scheduled preview
        isCompleted: false
      });
    });
    
    return filteredTasks;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (monthIndex: string) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(monthIndex), 1));
  };

  const handleYearChange = (year: string) => {
    setCurrentDate(new Date(parseInt(year), currentDate.getMonth(), 1));
  };

  const getTaskGroup = (task: Task) => {
    return groups.find(g => g.id === task.groupId);
  };

  const getTaskColor = (task: Task) => {
    // Priority: custom color > group color > level color
    if (task.customColor) return task.customColor;
    
    const group = getTaskGroup(task);
    if (group && group.color) return group.color;
    
    return LEVEL_COLORS[task.level];
  };

  const isGradientColor = (color: string) => {
    return color && (color.includes('gradient') || color.includes('linear-gradient'));
  };

  const getTaskNameStyle = (task: Task) => {
    const taskColor = getTaskColor(task);
    if (isGradientColor(taskColor)) {
      return {
        background: taskColor,
        backgroundClip: 'text' as any,
        WebkitBackgroundClip: 'text',
        color: 'transparent'
      };
    }
    return {};
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <Button
          variant="outline"
          onClick={onBackToTasks}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </Button>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Select value={currentDate.getMonth().toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthNames.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={currentDate.getFullYear().toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {/* Calendar - Scrollable */}
      <ScrollArea className="flex-1 px-6 pb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 min-h-[800px]">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const tasksForDate = getTasksForDate(date);
              const isToday = date && date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`min-h-[150px] p-3 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors ${
                    date 
                      ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                      : 'bg-gray-50 dark:bg-gray-900'
                  } ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-semibold mb-2 ${
                        isToday 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1 max-h-[120px] overflow-y-auto">
                        {tasksForDate.map(task => {
                          const taskColor = getTaskColor(task);
                          const nameStyle = getTaskNameStyle(task);
                          
                          return (
                            <div
                              key={`${task.id}-${date.getDate()}`}
                              className={`text-xs p-2 rounded transition-all font-medium ${
                                task.isScheduled 
                                  ? 'opacity-70 border border-dashed border-gray-400 cursor-default' 
                                  : task.isCompleted 
                                    ? 'opacity-60 line-through cursor-pointer hover:opacity-80' 
                                    : 'cursor-pointer hover:opacity-80'
                              } ${isGradientColor(taskColor) ? 'text-white' : 'text-black dark:text-white'}`}
                              style={{ 
                                backgroundColor: isGradientColor(taskColor) ? 'transparent' : taskColor,
                                background: isGradientColor(taskColor) ? taskColor : undefined
                              }}
                              onClick={() => !task.isScheduled && onTaskComplete(task, !task.isCompleted)}
                              title={
                                task.isScheduled 
                                  ? `Scheduled: ${task.name} (${task.level} - ${task.duration}min)`
                                  : `${task.name} (${task.level} - ${task.duration}min) - Click to ${task.isCompleted ? 'uncomplete' : 'complete'}`
                              }
                            >
                              <div className="truncate">
                                {task.isScheduled ? '⏰ ' : ''}{task.name}
                              </div>
                               <div className={`text-xs opacity-80 mt-1 ${isGradientColor(taskColor) ? 'text-white' : 'text-black dark:text-white'}`}>
                                {task.duration}min • {task.level}{task.isScheduled ? ' • Scheduled' : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CalendarPage;
