import { useState } from 'react';
import { ArrowLeft, Edit, Camera, Gift, RotateCcw, Shield, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserStats } from '@/types';
import ImageCropper from './ImageCropper';
import AchievementBadge from './AchievementBadge';
import AdminPinDialog from './AdminPinDialog';
import AdminTasksDialog from './AdminTasksDialog';
import CustomAlert from './CustomAlert';
import { Task, Group } from '@/types';
import { useFundayCounter } from '@/hooks/useFundayCounter';
import { useAuth } from '@/hooks/useAuth';

interface ProfileProps {
  userStats: UserStats;
  onUserStatsChange: (updater: (prev: UserStats) => UserStats) => void;
  onBackToTasks: () => void;
  isAdminMode: boolean;
  onAdminModeChange: (isAdmin: boolean) => void;
  onClearAllTasks?: () => Promise<void>;
  tasks?: Task[];
  groups?: Group[];
  onTaskDelete?: (taskId: string) => void;
}

const Profile = ({ userStats, onUserStatsChange, onBackToTasks, isAdminMode, onAdminModeChange, onClearAllTasks, tasks = [], groups = [], onTaskDelete }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userStats.userName);
  const [editStatus, setEditStatus] = useState(userStats.status);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const [showAdminPinDialog, setShowAdminPinDialog] = useState(false);
  const [showAdminTasksDialog, setShowAdminTasksDialog] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);

  const { spendFunday } = useFundayCounter({ userStats, onUserStatsChange });
  const { signOut, deleteAccount } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveProfile = () => {
    onUserStatsChange(prev => ({
      ...prev,
      userName: editName,
      status: editStatus
    }));
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setTempImageSrc(imageUrl);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    onUserStatsChange(prev => ({
      ...prev,
      profileImage: croppedImage
    }));
    setCropperOpen(false);
    setTempImageSrc('');
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setTempImageSrc('');
  };

  const useFunday = () => {
    if (userStats.fundayCount > 0) {
      spendFunday();
    }
  };

  const handleAdminControl = () => {
    if (isAdminMode) {
      onAdminModeChange(false);
    } else {
      setShowAdminPinDialog(true);
    }
  };

  const handleAdminPinVerified = () => {
    onAdminModeChange(true);
  };

  const resetData = () => {
    setShowResetAlert(true);
  };

  const confirmResetData = () => {
    // Reset user stats only
    onUserStatsChange(prev => ({
      ...prev,
      totalTasks: 0,
      completedTasks: 0,
      currentStreak: 0,
      level: 1,
      points: 0,
      rewardMinutes: 0,
      fundayCount: 0,
      fundaysSpent: 0
    }));
    setShowResetAlert(false);
  };

  const resetRewardTimer = () => {
    onUserStatsChange(prev => ({
      ...prev,
      rewardMinutes: 0
    }));
  };

  const clearAllTasks = async () => {
    try {
      if (onClearAllTasks) {
        await onClearAllTasks();
      }
      // Also clear scheduled tasks from localStorage
      localStorage.removeItem('scheduledTasks');
    } catch (error) {
      console.error('Error clearing tasks:', error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    if (onTaskDelete) {
      // Handle scheduled tasks
      if (taskId.startsWith('scheduled_')) {
        const scheduledTasks = JSON.parse(localStorage.getItem('scheduledTasks') || '[]');
        const filteredTasks = scheduledTasks.filter((st: any) => `scheduled_${st.key}` !== taskId);
        localStorage.setItem('scheduledTasks', JSON.stringify(filteredTasks));
      } else {
        await onTaskDelete(taskId);
      }
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      // Redirect will be handled by auth state change
    }
  };

  const handleDeleteAccount = async () => {
    const { error, message } = await deleteAccount();
    if (error) {
      console.error('Failed to delete account:', error);
    } else {
      console.log(message);
    }
    setShowDeleteConfirm(false);
  };

  const getNextMilestone = () => {
    const milestones = [100, 500, 1000];
    for (let i = 0; i < milestones.length; i++) {
      if (userStats.points < milestones[i]) {
        return milestones[i];
      }
    }
    const additionalMilestones = Math.ceil((userStats.points - 1000) / 500) * 500 + 1000;
    return Math.min(additionalMilestones + 500, 1000000);
  };

  const getProgressToNextMilestone = () => {
    const nextMilestone = getNextMilestone();
    const previousMilestone = nextMilestone <= 1000 ? 
      (nextMilestone === 100 ? 0 : nextMilestone === 500 ? 100 : 500) :
      nextMilestone - 500;
    
    return ((userStats.points - previousMilestone) / (nextMilestone - previousMilestone)) * 100;
  };

  const generateAchievements = () => {
    const achievements = [
      {
        id: 'first-task',
        title: 'First Steps',
        description: 'Complete your first task (+5 minutes)',
        icon: 'star',
        color: 'bg-blue-500',
        unlocked: userStats.completedTasks >= 1,
        unlockedAt: userStats.completedTasks >= 1 ? new Date() : undefined
      },
      {
        id: 'task-master',
        title: 'Task Master',
        description: 'Complete 10 tasks (+15 minutes)',
        icon: 'trophy',
        color: 'bg-green-500',
        unlocked: userStats.completedTasks >= 10,
        unlockedAt: userStats.completedTasks >= 10 ? new Date() : undefined
      },
      {
        id: 'point-collector',
        title: 'Point Collector',
        description: 'Earn 100 achievement points (+20 minutes)',
        icon: 'zap',
        color: 'bg-yellow-500',
        unlocked: userStats.points >= 100,
        unlockedAt: userStats.points >= 100 ? new Date() : undefined
      },
      {
        id: 'level-up',
        title: 'Level Up!',
        description: 'Reach level 2 (+10 minutes)',
        icon: 'award',
        color: 'bg-purple-500',
        unlocked: userStats.level >= 2,
        unlockedAt: userStats.level >= 2 ? new Date() : undefined
      },
      {
        id: 'streak-starter',
        title: 'Streak Starter',
        description: 'Maintain a 3-day streak (+25 minutes)',
        icon: 'target',
        color: 'bg-orange-500',
        unlocked: userStats.currentStreak >= 3,
        unlockedAt: userStats.currentStreak >= 3 ? new Date() : undefined
      },
      {
        id: 'productivity-king',
        title: 'Productivity King',
        description: 'Complete 50 tasks (+50 minutes)',
        icon: 'crown',
        color: 'bg-red-500',
        unlocked: userStats.completedTasks >= 50,
        unlockedAt: userStats.completedTasks >= 50 ? new Date() : undefined
      }
    ];
    return achievements;
  };

  const achievements = generateAchievements();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBackToTasks} className="text-gray-600 dark:text-gray-400">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h1>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
              User Profile
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-600 dark:text-gray-400"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                 {isAdminMode && (
                   <>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={resetData}
                       className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                       title="Reset User Data"
                     >
                       <RotateCcw className="w-4 h-4" />
                     </Button>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={resetRewardTimer}
                       className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                       title="Reset Reward Timer"
                     >
                       <Gift className="w-4 h-4" />
                     </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllTasks}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                        title="Clear All Tasks"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdminTasksDialog(true)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        title="View & Manage All Tasks"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                   </>
                 )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {userStats.profileImage ? (
                    <img
                      src={userStats.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userStats.userName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    onClick={() => document.getElementById('profile-image')?.click()}
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <Input
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      placeholder="Your status"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveProfile}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {userStats.userName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full inline-block">
                      {userStats.status}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Badges */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Achievement Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Level & Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current Level</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  Level {userStats.level}
                </Badge>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Achievement Points</span>
                  <span className="text-gray-800 dark:text-gray-200">{userStats.points} / {getNextMilestone()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressToNextMilestone()}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getNextMilestone() - userStats.points} points to next milestone
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                <Gift className="w-5 h-5" />
                Funday Holidays
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {userStats.fundayCount}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Available Fundays
                </p>
              </div>
              <Button
                onClick={useFunday}
                disabled={userStats.fundayCount === 0}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Use Funday
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Earn 1 Funday for every 100 achievement points
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                <Shield className="w-5 h-5" />
                Admin Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-sm px-3 py-1 rounded-full inline-block ${
                  isAdminMode 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {isAdminMode ? 'Admin mode is active' : 'Admin mode is disabled'}
                </div>
              </div>
              <Button
                onClick={handleAdminControl}
                className={`w-full ${
                  isAdminMode 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isAdminMode ? 'Disable Admin Mode' : 'Enable Admin Mode'}
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Enables advanced task management features
              </p>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Sign Out
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="w-full border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete Account
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Permanently delete your account and all data
              </p>
            </CardContent>
          </Card>

          {/* Task Statistics */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Task Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {userStats.totalTasks}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {userStats.completedTasks}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {userStats.currentStreak}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {userStats.rewardMinutes}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reward Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Cropper Dialog */}
      <ImageCropper
        imageSrc={tempImageSrc}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        isOpen={cropperOpen}
      />

      {/* Admin PIN Dialog */}
      <AdminPinDialog
        open={showAdminPinDialog}
        onOpenChange={setShowAdminPinDialog}
        onPinVerified={handleAdminPinVerified}
      />
      
      {/* Reset Data Alert */}
      <CustomAlert
        isOpen={showResetAlert}
        onClose={() => setShowResetAlert(false)}
        onConfirm={confirmResetData}
        title="Reset User Data"
        message="This will permanently reset your level, points, streak, and task counters. This action cannot be undone. Your tasks and groups will remain intact."
        confirmText="Reset Data"
        cancelText="Cancel"
        type="danger"
      />

      {/* Delete Account Alert */}
      <CustomAlert
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="This will permanently delete your account and all associated data including tasks, groups, and achievements. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
        type="danger"
      />

      {/* Admin Tasks Dialog */}
      <AdminTasksDialog
        open={showAdminTasksDialog}
        onOpenChange={setShowAdminTasksDialog}
        tasks={tasks}
        groups={groups}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

export default Profile;