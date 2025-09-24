// topbar

import { User, Trophy, Moon, Sun, Calendar, Clock, HelpCircle, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import NotificationSystem, { Notification } from './NotificationSystem';
import RewardTimerTopBar from './RewardTimerTopBar';

interface TopBarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentStreak: number;
  onProfileClick: () => void;
  onAchievementsClick: () => void;
  onLogoClick?: () => void;
  onHelpClick?: () => void;
  onCalendarClick?: () => void;
  notifications?: Notification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onRemoveNotification?: (id: string) => void;
  isAdminMode?: boolean;
  rewardMinutes?: number;
  onRewardUse?: (minutesUsed: number) => void;
  hasCompletedCoreTask?: boolean;
}

const TopBar = ({ 
  darkMode, 
  toggleDarkMode, 
  currentStreak,
  onProfileClick,
  onAchievementsClick,
  onLogoClick = () => {},
  onHelpClick = () => {},
  onCalendarClick = () => {},
  notifications = [],
  onMarkNotificationAsRead = () => {},
  onMarkAllNotificationsAsRead = () => {},
  onRemoveNotification = () => {},
  isAdminMode = false,
  rewardMinutes = 0,
  onRewardUse = () => {},
  hasCompletedCoreTask = false
}: TopBarProps) => {
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeToMidnight = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeToMidnight / (1000 * 60 * 60));
    const minutes = Math.floor((timeToMidnight % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeToMidnight % (1000 * 60)) / 1000);
    
    return {
      time: now.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }),
      date: now.toLocaleDateString(),
      day: days[now.getDay()],
      countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
  });
  const [showTimePopup, setShowTimePopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const timeToMidnight = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(timeToMidnight / (1000 * 60 * 60));
      const minutes = Math.floor((timeToMidnight % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeToMidnight % (1000 * 60)) / 1000);
      
      setDateTime({
        time: now.toLocaleTimeString('en-US', { 
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true 
        }),
        date: now.toLocaleDateString(),
        day: days[now.getDay()],
        countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - App name and logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <h1 className="text-lg sm:text-2xl font-bold font-avenir text-black dark:text-white">
                <span className="hidden sm:inline">ULTIMATE ME</span>
                <span className="sm:hidden">UM</span>
                {isAdminMode && <span className="text-red-600 dark:text-red-400 text-xs font-medium ml-1">Admin</span>}
              </h1>
            </button>
          </div>

          {/* Right side - Controls and info */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Streak - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
              <div className="w-4 h-4 flex items-center justify-center">
                {currentStreak > 0 ? (
                  <Zap className="w-4 h-4 text-orange-500" />
                ) : (
                  <Zap className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <span className={`text-sm font-semibold ${
                currentStreak > 0 
                  ? 'text-orange-700 dark:text-orange-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {currentStreak}
              </span>
            </div>

            {/* Reward Timer */}
            <RewardTimerTopBar
              rewardMinutes={rewardMinutes}
              onRewardUse={onRewardUse}
              hasCompletedCoreTask={hasCompletedCoreTask || false}
            />

            {/* Calendar - Show only date on mobile */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onCalendarClick}
                  className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 sm:p-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300"
                >
                  <Calendar className="w-6 h-6" />
                  <span className="hidden sm:inline">{dateTime.date}</span>
                  <span className="hidden sm:inline text-gray-400 dark:text-gray-500">•</span>
                  <span className="hidden lg:inline">{dateTime.day}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Calendar</p>
              </TooltipContent>
            </Tooltip>

            {/* Separator - Hidden on mobile */}
            <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 sm:p-2"
                >
                  {darkMode ? <Sun className="w-6 h-6 sm:w-7 sm:h-7" /> : <Moon className="w-6 h-6 sm:w-7 sm:h-7" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{darkMode ? 'Light Mode' : 'Dark Mode'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Help Guide */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onHelpClick}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 sm:p-2"
                >
                  <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help Guide</p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <NotificationSystem
              notifications={notifications}
              onMarkAsRead={onMarkNotificationAsRead}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
              onRemoveNotification={onRemoveNotification}
            />

            {/* Achievements */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onAchievementsClick}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 sm:p-2"
                >
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Achievements</p>
              </TooltipContent>
            </Tooltip>

            {/* Profile */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onProfileClick}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 sm:p-2"
                >
                  <User className="w-6 h-6 sm:w-7 sm:h-7" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>

            {/* Separator - Hidden on mobile */}
            <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

            {/* Time - Simplified on mobile */}
            <div 
              className="relative flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
              onContextMenu={(e) => {
                e.preventDefault();
                setShowTimePopup(true);
              }}
              onClick={() => setShowTimePopup(false)}
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-mono font-bold hidden sm:inline">{dateTime.countdown}</span>
              <span className="font-mono font-bold sm:hidden">{dateTime.countdown.split(':').slice(0,2).join(':')}</span>
              
              {showTimePopup && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {dateTime.time}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {dateTime.date}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {dateTime.day}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TopBar;
