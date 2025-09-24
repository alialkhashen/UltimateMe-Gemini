// Index.tsx

import { useState, useEffect } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useFundayCounter } from '@/hooks/useFundayCounter';
import { Group, Task, UserStats, TASK_REWARDS } from '@/types';
import { getToday } from '@/utils/dateUtils';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import TopBar from "@/components/TopBar";
import GroupTabs from "@/components/GroupTabs";
import TaskBoard from "@/components/TaskBoard";
import Profile from "@/components/Profile";
import Achievements from "@/components/Achievements";
import MotivationalQuotes from "@/components/MotivationalQuotes";
import HelpGuide from "@/components/HelpGuide";
import LevelUpCongrats from "@/components/LevelUpCongrats";
import CalendarPage from "@/pages/Calendar";

const Index = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const {
    tasks,
    groups,
    userStats,
    loading,
    updateTask,
    createTask,
    deleteTask,
    updateUserStats,
    createGroup,
    updateGroup,
    deleteGroup,
    reorderGroups
  } = useSupabaseData(user);

  const [activeView, setActiveView] = useState<'tasks' | 'profile' | 'achievements' | 'calendar'>('tasks');
  const [darkMode, setDarkMode] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState('');

  // Auto-select first custom group when groups load
  useEffect(() => {
    if (groups.length > 0 && !activeGroupId) {
      const firstCustomGroup = groups.find(g => !g.isDefault);
      if (firstCustomGroup) {
        setActiveGroupId(firstCustomGroup.id);
      }
    }
  }, [groups, activeGroupId]);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Level up tracking
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Core task tracking for reward restrictions
  const hasCompletedCoreTask = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.some(task => 
      task.level === 'core' && 
      task.isCompleted && 
      task.lastInteractionDate === today
    );
  };

  // Simplified streak logic - only requires core task completion
  const checkStreakCondition = () => {
    return hasCompletedCoreTask();
  };

  // Check and update streak daily
  useEffect(() => {
    const updateStreakDaily = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastStreakDate = localStorage.getItem('lastStreakDate');
      
      // Don't update multiple times per day
      if (lastStreakDate === today) return;
      
      if (checkStreakCondition()) {
        // User completed core task today - continue or start streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastStreakDate === yesterdayStr) {
          // Consecutive day, increment streak
          updateUserStats(prev => ({ ...prev, currentStreak: prev.currentStreak + 1 }));
        } else if (!lastStreakDate || lastStreakDate < yesterdayStr) {
          // First day or gap, start new streak
          updateUserStats(prev => ({ ...prev, currentStreak: 1 }));
        }
        localStorage.setItem('lastStreakDate', today);
      } else {
        // Check if we should reset streak (if day passed without core task)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastStreakDate && lastStreakDate < yesterdayStr) {
          // A day passed without completing a core task, reset streak
          updateUserStats(prev => ({ ...prev, currentStreak: 0 }));
        }
      }
    };

    updateStreakDaily();

    // Check daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 1, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    const midnightTimer = setTimeout(updateStreakDaily, msUntilMidnight);
    
    return () => clearTimeout(midnightTimer);
  }, [tasks, userStats.currentStreak]);

  // Update streak immediately when core task is completed
  useEffect(() => {
    if (hasCompletedCoreTask()) {
      const today = new Date().toISOString().split('T')[0];
      const lastStreakDate = localStorage.getItem('lastStreakDate');
      
      if (lastStreakDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastStreakDate === yesterdayStr) {
          updateUserStats(prev => ({ ...prev, currentStreak: prev.currentStreak + 1 }));
        } else {
          updateUserStats(prev => ({ ...prev, currentStreak: 1 }));
        }
        localStorage.setItem('lastStreakDate', today);
      }
    }
  }, [tasks.filter(t => t.level === 'core' && t.isCompleted).length]);
  const [currentLevel, setCurrentLevel] = useState(userStats.level);

  const handleUserStatsChange = (updater: (prev: UserStats) => UserStats) => {
    const updated = updater(userStats);
    
    // Check for level up
    const newLevel = Math.floor(updated.points / 100) + 1;
    if (newLevel > currentLevel) {
      setCurrentLevel(newLevel);
      setShowLevelUp(true);
      updated.level = newLevel;
    }
    
    updateUserStats(() => updated);
  };
  
  // Auto-update funday counter based on achievement points
  useFundayCounter({ userStats, onUserStatsChange: handleUserStatsChange });

  // Show loading while auth is being checked
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogoClick = () => {
    setActiveView('tasks');
  };

  const handleTaskComplete = (task: Task, isCompleted: boolean) => {
    // Find the completed tasks group by name
    const completedGroup = groups.find(g => g.name === 'Completed Tasks');
    
    if (!completedGroup && isCompleted) {
      console.error('Completed Tasks group not found');
      return;
    }
    
    const updatedTask = { 
      ...task, 
      isCompleted: isCompleted,
      groupId: isCompleted ? completedGroup!.id : task.groupId
    };
    updateTask(task.id, updatedTask);
    
    if (isCompleted) {
      const reward = TASK_REWARDS[task.level];
      handleUserStatsChange(prev => ({
        ...prev,
        points: prev.points + reward.points,
        rewardMinutes: prev.rewardMinutes + reward.minutes,
        completedTasks: prev.completedTasks + 1
      }));
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="flex flex-col h-screen">
        <TopBar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentStreak={userStats.currentStreak}
          onProfileClick={() => setActiveView('profile')}
          onAchievementsClick={() => setActiveView('achievements')}
          onCalendarClick={() => setActiveView('calendar')}
          onLogoClick={handleLogoClick}
          onHelpClick={() => setShowHelpGuide(true)}
          isAdminMode={isAdminMode}
          rewardMinutes={userStats.rewardMinutes}
          onRewardUse={(minutesUsed) => {
            updateUserStats(prev => ({
              ...prev,
              rewardMinutes: prev.rewardMinutes - minutesUsed
            }));
          }}
          hasCompletedCoreTask={hasCompletedCoreTask()}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeView === 'tasks' && (
            <>
              <div className="px-3 sm:px-6 pt-2 sm:pt-4">
                <MotivationalQuotes />
              </div>
              <GroupTabs
                groups={groups}
                activeGroupId={activeGroupId}
                onGroupSelect={setActiveGroupId}
                onGroupsChange={(newGroup) => createGroup(newGroup)}
                onGroupUpdate={updateGroup}
                onGroupDelete={deleteGroup}
                onGroupReorder={reorderGroups}
              />
              <div className="flex-1 p-3 sm:p-6 overflow-hidden">
                <TaskBoard
                  tasks={tasks}
                  activeGroupId={activeGroupId}
                  groups={groups}
                  onTaskCreate={createTask}
                  onTaskUpdate={updateTask}
                  onTaskDelete={deleteTask}
                  onUserStatsChange={handleUserStatsChange}
                  userStats={userStats}
                  onPenalty={(penaltyMinutes) => {
                    updateUserStats(prev => ({
                      ...prev,
                      rewardMinutes: prev.rewardMinutes - penaltyMinutes
                    }));
                  }}
                  isAdminMode={isAdminMode}
                />
              </div>
              
              {/* Copyright Footer - Only on main tasks page */}
              <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded z-50 pointer-events-none max-w-[calc(100vw-1rem)] sm:max-w-none">
                <span className="hidden sm:inline">This application was developed by Ali Alkhashen © 2025. All rights reserved.</span>
                <span className="sm:hidden">© 2025 Ali Alkhashen</span>
              </div>
            </>
          )}
          
          {activeView === 'profile' && (
            <div className="flex-1 p-3 sm:p-6 overflow-auto">
              <Profile
                userStats={userStats}
                onUserStatsChange={handleUserStatsChange}
                onBackToTasks={() => setActiveView('tasks')}
                isAdminMode={isAdminMode}
                onAdminModeChange={setIsAdminMode}
                 onClearAllTasks={async () => {
                   // Clear all tasks
                   const allTasks = tasks.filter(task => task.id);
                   for (const task of allTasks) {
                     await deleteTask(task.id);
                   }
                   // Also clear scheduled tasks from localStorage
                   localStorage.removeItem('scheduledTasks');
                 }}
                 tasks={tasks}
                 groups={groups}
                 onTaskDelete={deleteTask}
              />
            </div>
          )}
          
          {activeView === 'achievements' && (
            <div className="flex-1 p-3 sm:p-6 overflow-auto">
              <Achievements
                userStats={userStats}
                onBackToTasks={() => setActiveView('tasks')}
              />
            </div>
          )}

          {activeView === 'calendar' && (
            <CalendarPage
              tasks={tasks}
              groups={groups}
              onTaskComplete={handleTaskComplete}
              onBackToTasks={() => setActiveView('tasks')}
            />
          )}
        </div>
      </div>

      {/* Help Guide */}
      <HelpGuide
        isOpen={showHelpGuide}
        onClose={() => setShowHelpGuide(false)}
      />

      {/* Level Up Congratulations */}
      <LevelUpCongrats
        newLevel={currentLevel}
        isVisible={showLevelUp}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
};

export default Index;
