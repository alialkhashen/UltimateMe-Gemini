import { useState } from 'react';
import { ArrowLeft, Trophy, Target, Award, Calendar, Gift, Edit, Check, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserStats } from '@/types';
import CreateCustomGoalDialog from '@/components/CreateCustomGoalDialog';
import { useCustomGoals, CustomGoal } from '@/hooks/useCustomGoals';
import CustomAlert from './CustomAlert';

interface GoalStep {
  id: string;
  text: string;
  completed: boolean;
}

interface AchievementsProps {
  userStats: UserStats;
  onBackToTasks: () => void;
}

const Achievements = ({ userStats, onBackToTasks }: AchievementsProps) => {
  const { goals: customGoals, createGoal, updateGoal, deleteGoal } = useCustomGoals();
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<CustomGoal | null>(null);

  const premadeGoals = [
    { title: "Drink 8 glasses of water daily", category: "Health", points: 10, minutes: 30 },
    { title: "Exercise for 30 minutes", category: "Health", points: 15, minutes: 45 },
    { title: "Read 20 pages of a book", category: "Learning", points: 12, minutes: 35 },
    { title: "Meditate for 10 minutes", category: "Wellness", points: 8, minutes: 25 },
    { title: "Write in journal for 15 minutes", category: "Wellness", points: 10, minutes: 30 },
    { title: "Complete a coding challenge", category: "Learning", points: 20, minutes: 60 },
    { title: "Take a 15-minute walk", category: "Health", points: 8, minutes: 20 },
    { title: "Organize workspace", category: "Productivity", points: 10, minutes: 30 },
    { title: "Learn 10 new vocabulary words", category: "Learning", points: 12, minutes: 35 },
    { title: "Practice a musical instrument", category: "Creative", points: 15, minutes: 45 },
    { title: "Cook a healthy meal", category: "Health", points: 12, minutes: 40 },
    { title: "Call a friend or family member", category: "Social", points: 8, minutes: 25 },
    { title: "Do 50 push-ups", category: "Fitness", points: 10, minutes: 20 },
    { title: "Stretch for 10 minutes", category: "Health", points: 6, minutes: 15 },
    { title: "Write 500 words", category: "Creative", points: 15, minutes: 45 },
    { title: "Learn a new skill online", category: "Learning", points: 18, minutes: 50 },
    { title: "Clean and organize bedroom", category: "Productivity", points: 12, minutes: 40 },
    { title: "Practice deep breathing", category: "Wellness", points: 5, minutes: 15 },
    { title: "Review and plan tomorrow", category: "Planning", points: 8, minutes: 20 },
    { title: "Complete online course module", category: "Learning", points: 25, minutes: 75 },
    { title: "Do 100 jumping jacks", category: "Fitness", points: 8, minutes: 15 },
    { title: "Practice gratitude (write 3 things)", category: "Wellness", points: 6, minutes: 10 },
    { title: "Declutter digital files", category: "Productivity", points: 10, minutes: 30 },
    { title: "Watch educational video", category: "Learning", points: 8, minutes: 25 },
    { title: "Practice photography", category: "Creative", points: 12, minutes: 35 },
    { title: "Do yoga for 20 minutes", category: "Health", points: 12, minutes: 40 },
    { title: "Update resume or LinkedIn", category: "Career", points: 15, minutes: 45 },
    { title: "Practice public speaking", category: "Skills", points: 15, minutes: 45 },
    { title: "Learn basic phrases in new language", category: "Learning", points: 12, minutes: 35 },
    { title: "Do meal prep for tomorrow", category: "Health", points: 15, minutes: 45 },
    { title: "Practice mindfulness", category: "Wellness", points: 8, minutes: 20 },
    { title: "Complete a puzzle", category: "Mental", points: 10, minutes: 30 },
    { title: "Draw or sketch for 20 minutes", category: "Creative", points: 10, minutes: 30 },
    { title: "Listen to educational podcast", category: "Learning", points: 8, minutes: 25 },
    { title: "Do plank for 2 minutes", category: "Fitness", points: 6, minutes: 15 },
    { title: "Research investment options", category: "Finance", points: 15, minutes: 45 },
    { title: "Practice typing speed", category: "Skills", points: 8, minutes: 20 },
    { title: "Clean kitchen thoroughly", category: "Productivity", points: 12, minutes: 40 },
    { title: "Practice chess online", category: "Mental", points: 10, minutes: 30 },
    { title: "Do 30 squats", category: "Fitness", points: 6, minutes: 15 },
    { title: "Write a blog post", category: "Creative", points: 20, minutes: 60 },
    { title: "Learn keyboard shortcuts", category: "Skills", points: 10, minutes: 30 },
    { title: "Practice calligraphy", category: "Creative", points: 12, minutes: 35 },
    { title: "Do laundry and fold clothes", category: "Productivity", points: 10, minutes: 30 },
    { title: "Practice mental math", category: "Mental", points: 8, minutes: 20 },
    { title: "Backup computer files", category: "Productivity", points: 8, minutes: 25 },
    { title: "Practice origami", category: "Creative", points: 10, minutes: 30 },
    { title: "Do planks and core exercises", category: "Fitness", points: 10, minutes: 25 },
    { title: "Study flashcards", category: "Learning", points: 10, minutes: 30 },
    { title: "Practice speed reading", category: "Skills", points: 12, minutes: 35 },
    { title: "Organize email inbox", category: "Productivity", points: 8, minutes: 25 },
    { title: "Practice dance moves", category: "Creative", points: 12, minutes: 35 },
    { title: "Do research for project", category: "Learning", points: 15, minutes: 45 },
    { title: "Practice presentation skills", category: "Skills", points: 15, minutes: 45 },
    { title: "Clean and organize car", category: "Productivity", points: 12, minutes: 40 },
    { title: "Practice memory techniques", category: "Mental", points: 10, minutes: 30 },
    { title: "Do burpees exercise", category: "Fitness", points: 12, minutes: 25 },
    { title: "Practice creative writing", category: "Creative", points: 15, minutes: 45 },
    { title: "Learn about current events", category: "Learning", points: 8, minutes: 25 },
    { title: "Practice problem solving", category: "Mental", points: 12, minutes: 35 },
    { title: "Do strength training", category: "Fitness", points: 15, minutes: 45 },
    { title: "Practice time management", category: "Skills", points: 10, minutes: 30 },
    { title: "Organize photo collection", category: "Productivity", points: 12, minutes: 40 },
    { title: "Practice meditation walking", category: "Wellness", points: 10, minutes: 30 },
    { title: "Learn new cooking technique", category: "Skills", points: 15, minutes: 45 },
    { title: "Do balance exercises", category: "Fitness", points: 8, minutes: 20 },
    { title: "Practice improvisational skills", category: "Creative", points: 12, minutes: 35 },
    { title: "Study industry trends", category: "Career", points: 15, minutes: 45 },
    { title: "Practice active listening", category: "Social", points: 8, minutes: 20 },
    { title: "Do flexibility exercises", category: "Health", points: 10, minutes: 30 },
    { title: "Practice negotiation skills", category: "Skills", points: 15, minutes: 45 },
    { title: "Organize important documents", category: "Productivity", points: 12, minutes: 40 },
    { title: "Practice emotional intelligence", category: "Wellness", points: 10, minutes: 30 },
    { title: "Do cardio workout", category: "Fitness", points: 18, minutes: 50 },
    { title: "Practice leadership skills", category: "Skills", points: 15, minutes: 45 },
    { title: "Learn about personal finance", category: "Finance", points: 12, minutes: 35 },
    { title: "Practice conflict resolution", category: "Social", points: 12, minutes: 35 },
    { title: "Do high-intensity interval training", category: "Fitness", points: 20, minutes: 60 },
    { title: "Practice critical thinking", category: "Mental", points: 12, minutes: 35 },
    { title: "Study productivity techniques", category: "Skills", points: 10, minutes: 30 },
    { title: "Practice empathy exercises", category: "Social", points: 8, minutes: 20 },
    { title: "Do resistance band workout", category: "Fitness", points: 12, minutes: 35 },
    { title: "Practice stress management", category: "Wellness", points: 10, minutes: 30 },
    { title: "Learn about sustainability", category: "Learning", points: 10, minutes: 30 },
    { title: "Practice team collaboration", category: "Social", points: 12, minutes: 35 },
    { title: "Do swimming or water exercise", category: "Fitness", points: 18, minutes: 50 },
    { title: "Practice innovation thinking", category: "Mental", points: 15, minutes: 45 },
    { title: "Study goal setting techniques", category: "Skills", points: 10, minutes: 30 },
    { title: "Practice cultural awareness", category: "Social", points: 10, minutes: 30 },
    { title: "Do outdoor activity", category: "Health", points: 15, minutes: 45 },
    { title: "Practice decision making", category: "Mental", points: 12, minutes: 35 },
    { title: "Learn about technology trends", category: "Learning", points: 12, minutes: 35 },
    { title: "Practice adaptability skills", category: "Skills", points: 10, minutes: 30 },
    { title: "Do recreational sports", category: "Fitness", points: 18, minutes: 50 },
    { title: "Practice self-reflection", category: "Wellness", points: 8, minutes: 20 },
    { title: "Study communication techniques", category: "Skills", points: 12, minutes: 35 },
    { title: "Practice inclusivity awareness", category: "Social", points: 10, minutes: 30 },
    { title: "Do martial arts practice", category: "Fitness", points: 15, minutes: 45 },
    { title: "Practice strategic thinking", category: "Mental", points: 15, minutes: 45 },
    { title: "Learn about health and nutrition", category: "Health", points: 12, minutes: 35 },
    { title: "Practice networking skills", category: "Career", points: 12, minutes: 35 },
    { title: "Do rock climbing or bouldering", category: "Fitness", points: 20, minutes: 60 },
    { title: "Practice resilience building", category: "Wellness", points: 10, minutes: 30 },
    { title: "Study environmental science", category: "Learning", points: 12, minutes: 35 },
    { title: "Practice mentoring skills", category: "Social", points: 15, minutes: 45 },
    { title: "Do obstacle course training", category: "Fitness", points: 22, minutes: 65 },
    { title: "Practice systems thinking", category: "Mental", points: 15, minutes: 45 }
  ];

  const achievements = [
    {
      id: 'first-task',
      title: 'First Steps',
      description: 'Complete your first task',
      icon: Trophy,
      completed: userStats.completedTasks >= 1,
      progress: Math.min(userStats.completedTasks, 1),
      target: 1,
      reward: { points: 10, minutes: 15 }
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      icon: Target,
      completed: userStats.completedTasks >= 10,
      progress: Math.min(userStats.completedTasks, 10),
      target: 10,
      reward: { points: 50, minutes: 60 }
    },
    {
      id: 'streak-starter',
      title: 'Streak Starter',
      description: 'Maintain a 3-day streak',
      icon: Award,
      completed: userStats.currentStreak >= 3,
      progress: Math.min(userStats.currentStreak, 3),
      target: 3,
      reward: { points: 30, minutes: 45 }
    },
    {
      id: 'dedicated',
      title: 'Dedicated',
      description: 'Maintain a 7-day streak',
      icon: Calendar,
      completed: userStats.currentStreak >= 7,
      progress: Math.min(userStats.currentStreak, 7),
      target: 7,
      reward: { points: 75, minutes: 90 }
    },
    {
      id: 'centurion',
      title: 'Centurion',
      description: 'Complete 100 tasks',
      icon: Gift,
      completed: userStats.completedTasks >= 100,
      progress: Math.min(userStats.completedTasks, 100),
      target: 100,
      reward: { points: 200, minutes: 300 }
    }
  ];

  const getTimeUntilDayEnd = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const msUntilEnd = endOfDay.getTime() - now.getTime();
    const hours = Math.floor(msUntilEnd / (1000 * 60 * 60));
    const minutes = Math.floor((msUntilEnd % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleGoalCreate = async (newGoal: any) => {
    await createGoal({
      title: newGoal.name,
      description: newGoal.notes,
      targetValue: 100,
      currentValue: 0,
      unit: 'percent',
      isCompleted: false,
      steps: newGoal.steps || [],
      notes: newGoal.notes || '',
      rewardPoints: newGoal.rewardPoints || 0,
      rewardMinutes: newGoal.rewardMinutes || 0
    });
    setIsCreatingGoal(false);
  };

  const handleGoalEdit = async (updatedGoal: any) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, {
        title: updatedGoal.name,
        description: updatedGoal.notes,
        isCompleted: updatedGoal.completed,
        steps: updatedGoal.steps || [],
        notes: updatedGoal.notes || '',
        rewardPoints: updatedGoal.rewardPoints || 0,
        rewardMinutes: updatedGoal.rewardMinutes || 0
      });
    }
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goal: CustomGoal) => {
    setGoalToDelete(goal);
    setShowDeleteAlert(true);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete.id);
    }
    setShowDeleteAlert(false);
    setGoalToDelete(null);
  };

  const toggleGoalCompletion = (goalId: string) => {
    const goal = customGoals.find(g => g.id === goalId);
    if (goal) {
      updateGoal(goalId, { isCompleted: !goal.isCompleted });
    }
  };

  const getCompletionPercentage = (goal: CustomGoal) => {
    if (goal.steps && goal.steps.length > 0) {
      const completedSteps = goal.steps.filter(step => step.completed).length;
      return Math.round((completedSteps / goal.steps.length) * 100);
    }
    return goal.isCompleted ? 100 : 0;
  };

  const openEditDialog = (goal: CustomGoal) => {
    const editGoal = {
      id: goal.id,
      name: goal.title,
      rewardPoints: goal.rewardPoints,
      rewardMinutes: goal.rewardMinutes,
      requirement: goal.description || '',
      notes: goal.notes,
      completed: goal.isCompleted,
      steps: goal.steps || [],
      createdAt: goal.createdAt
    };
    setEditingGoal(editGoal);
  };

  const closeDialog = () => {
    setIsCreatingGoal(false);
    setEditingGoal(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBackToTasks} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
      </div>

      {/* Daily Streak */}
      <Card className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <div className="text-2xl">🔥</div>
            Daily Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                {userStats.currentStreak} days
              </div>
              <p className="text-orange-600 dark:text-orange-400">
                Keep it going! Time left today: {getTimeUntilDayEnd()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon;
          return (
            <Card key={achievement.id} className={`transition-all duration-200 hover:shadow-lg ${
              achievement.completed 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className={`w-6 h-6 ${
                    achievement.completed 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  {achievement.completed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
                <CardTitle className={`text-lg ${
                  achievement.completed 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {achievement.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-4 ${
                  achievement.completed 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className={achievement.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                      Progress: {achievement.progress}/{achievement.target}
                    </span>
                    <span className={achievement.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                      {Math.round((achievement.progress / achievement.target) * 100)}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={(achievement.progress / achievement.target) * 100} 
                    className={`h-2 ${achievement.completed ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                  />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`flex items-center gap-1 ${
                      achievement.completed 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <Trophy className="w-3 h-3" />
                      {achievement.reward.points} pts
                    </span>
                    <span className={`flex items-center gap-1 ${
                      achievement.completed 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <Gift className="w-3 h-3" />
                      {achievement.reward.minutes} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Custom Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Custom Goals</h2>
          <Button onClick={() => setIsCreatingGoal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customGoals.map((goal) => (
            <Card key={goal.id} className={`transition-all duration-200 hover:shadow-lg ${
              goal.isCompleted 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${
                    goal.isCompleted 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {goal.title}
                  </CardTitle>
                  {goal.isCompleted && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {goal.description && (
                  <p className={`text-sm mb-3 ${
                    goal.isCompleted 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {goal.description}
                  </p>
                )}

                {goal.steps && goal.steps.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className={goal.isCompleted ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                        Steps: {goal.steps.filter(s => s.completed).length}/{goal.steps.length}
                      </span>
                      <span className={goal.isCompleted ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                        {getCompletionPercentage(goal)}%
                      </span>
                    </div>
                    <Progress 
                      value={getCompletionPercentage(goal)} 
                      className={`h-2 ${goal.isCompleted ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                    />
                    
                    {/* Individual Steps Display */}
                    <ScrollArea className="h-24 mt-3">
                      <div className="space-y-1 pr-2">
                        {goal.steps.map((step) => (
                          <div 
                            key={step.id} 
                            className={`flex items-center gap-2 text-xs p-2 rounded ${
                              step.completed 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                              step.completed 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-400'
                            }`}/>
                            <span className={step.completed ? 'line-through' : ''}>{step.text}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(goal)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant={goal.isCompleted ? "outline" : "default"}
                    onClick={() => toggleGoalCompletion(goal.id)}
                  >
                    {goal.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateCustomGoalDialog
        isOpen={isCreatingGoal || editingGoal !== null}
        onClose={closeDialog}
        onGoalCreate={handleGoalCreate}
        onGoalEdit={handleGoalEdit}
        editingGoal={editingGoal}
      />

      <CustomAlert
        isOpen={showDeleteAlert}
        onClose={() => {
          setShowDeleteAlert(false);
          setGoalToDelete(null);
        }}
        onConfirm={confirmDeleteGoal}
        title="Delete Custom Goal"
        message={`Are you sure you want to delete the goal "${goalToDelete?.title}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Achievements;