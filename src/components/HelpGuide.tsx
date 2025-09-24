
import { X, Trophy, Target, Users, Calendar, Zap, Gift, Star, Award, Palette, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpGuide = ({ isOpen, onClose }: HelpGuideProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-blue-600" />
            Ultimate Me - Application Guide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Welcome to Ultimate Me! This is your personal productivity hub with user authentication and cloud data storage. Create an account to save your progress and access your tasks anywhere.</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm font-medium">💡 First Time? Sign up to create your account and start building your productivity system!</p>
              </div>
            </CardContent>
          </Card>

          {/* Tasks System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Tasks & Difficulty Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Tasks are the foundation of your productivity journey. Each task has a difficulty level that determines its rewards and comes with advanced customization options:</p>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Badge className="bg-green-600 text-white">EASY</Badge>
                  <div>
                    <div className="font-semibold">2 points + 5 minutes</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Simple daily tasks</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Badge className="bg-yellow-600 text-white">MID</Badge>
                  <div>
                    <div className="font-semibold">5 points + 10 minutes</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Moderate difficulty</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Badge className="bg-red-600 text-white">HARD</Badge>
                  <div>
                    <div className="font-semibold">10 points + 20 minutes</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Difficult but rewarding</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Badge className="bg-purple-600 text-white">CORE</Badge>
                  <div>
                    <div className="font-semibold">25 points + 45 minutes</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Most challenging tasks - required for streaks and reward timer</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-4 h-4" />
                    <strong>Built-in Timer</strong>
                  </div>
                  <p className="text-sm">Each task includes a timer. Start it when you begin working and mark complete when finished!</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4" />
                    <strong>Custom Colors</strong>
                  </div>
                  <p className="text-sm">Personalize each task with custom colors for better organization and visual appeal!</p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <strong>Repeat Tasks</strong>
                  </div>
                  <p className="text-sm">Set tasks to repeat on specific days. Perfect for habits and recurring activities!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Integrated Calendar System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Access your comprehensive calendar by clicking the calendar icon next to the date in the top bar.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Calendar Features:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• View all tasks across all groups</li>
                    <li>• Today's scheduled tasks</li>
                    <li>• Repeated task patterns</li>
                    <li>• Custom task colors displayed</li>
                    <li>• Quick task completion from calendar</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Visual Indicators:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Colored dots show task colors</li>
                    <li>• Multiple tasks per day indicated</li>
                    <li>• Today highlighted in blue</li>
                    <li>• Interactive task management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Points & Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Advanced Reward System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Achievement Points
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Earn points by completing tasks. Points help you level up, unlock achievements, and earn Fundays!</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Reward Minutes
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Earn reward minutes for leisure activities. <strong>Important:</strong> You must complete at least 1 core task daily to unlock the reward timer!</p>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p className="text-sm"><strong>New Streak System:</strong> Maintain streaks by completing 1 core task AND earning 45+ reward minutes from other tasks daily. This ensures balanced productivity!</p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <p className="text-sm"><strong>Reward Timer Lock:</strong> The reward timer is locked until you complete at least one core task each day. This encourages tackling your most important work first!</p>
              </div>
            </CardContent>
          </Card>

          {/* Groups & Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Enhanced Task Groups & Cloud Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Organize your tasks with our advanced grouping system featuring extensive customization. All data is securely stored in the cloud and synced across your devices:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Default Groups (Icon Only):</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 text-center">📋</span>
                      <strong>All Tasks:</strong> Complete task overview (menu icon)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 text-center">✓</span>
                      <strong>Completed:</strong> Your accomplishments (check icon)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 text-center">📅</span>
                      <strong>Scheduled:</strong> Time-specific tasks (calendar icon)
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Custom Groups:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Create unlimited custom groups</li>
                    <li>• Choose from 500+ icons</li>
                    <li>• Custom color themes</li>
                    <li>• Personal organization system</li>
                    <li>• Automatically saved to your account</li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-sm"><strong>🔒 Secure Storage:</strong> All your tasks, groups, and progress are automatically saved to your personal cloud account.</p>
              </div>
            </CardContent>
          </Card>

          {/* Custom Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Custom Goals & Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Create and track your own custom goals with detailed progress management and reward systems.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Goal Features:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Custom title and description</li>
                    <li>• Progress tracking with target values</li>
                    <li>• Step-by-step completion tracking</li>
                    <li>• Target dates for deadlines</li>
                    <li>• Custom reward points and minutes</li>
                    <li>• Personal notes and details</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Management:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Create unlimited custom goals</li>
                    <li>• Edit goals anytime</li>
                    <li>• Delete goals with confirmation</li>
                    <li>• Mark steps as completed</li>
                    <li>• Visual progress indicators</li>
                    <li>• Completion celebrations</li>
                  </ul>
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                <p className="text-sm"><strong>💡 Pro Tip:</strong> Break down large goals into smaller steps to track progress more effectively and stay motivated!</p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                Achievements & Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Achievement Badges
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unlock badges by reaching milestones, completing tasks, earning points, and maintaining streaks.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    New Streak System
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Maintain streaks by completing 1 core task AND earning 45+ reward minutes from other tasks daily. This balanced approach ensures consistent progress!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-pink-500" />
                Pro Tips & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <strong>🎯 Strategic Planning:</strong> Use custom colors to categorize tasks by priority or context for better visual organization.
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong>📅 Calendar Integration:</strong> Check your calendar daily to see upcoming tasks, repeated tasks, and plan your schedule effectively.
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <strong>⏰ Timer Strategy:</strong> Use the built-in timer to track productivity and build focused work habits.
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <strong>🏆 Level Progression:</strong> Mix different difficulty levels to balance challenge, progress, and reward accumulation.
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <strong>🎨 Customization:</strong> Use the expanded icon library and colors to create a personalized productivity system.
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                  <strong>📊 Progress Tracking:</strong> Regularly check your profile and achievements to monitor growth and celebrate milestones.
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                  <strong>🔄 Habit Building:</strong> Use repeat tasks for daily habits - they'll automatically appear on scheduled days.
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                  <strong>☁️ Cloud Sync:</strong> Your data is automatically saved and synced - log in from any device to access your tasks.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpGuide;
