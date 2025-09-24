
import { Trophy, Star, Zap, Target, Award, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  const getIcon = (iconName: string) => {
    const iconMap = {
      trophy: Trophy,
      star: Star,
      zap: Zap,
      target: Target,
      award: Award,
      crown: Crown
    };
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Trophy;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className={`relative p-4 rounded-lg border-2 transition-all ${
      achievement.unlocked 
        ? 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' 
        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${
          achievement.unlocked 
            ? achievement.color 
            : 'bg-gray-300 dark:bg-gray-600'
        }`}>
          <div className={achievement.unlocked ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>
            {getIcon(achievement.icon)}
          </div>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${
            achievement.unlocked 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {achievement.title}
          </h4>
          <p className={`text-sm ${
            achievement.unlocked 
              ? 'text-gray-600 dark:text-gray-300' 
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            {achievement.description}
          </p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      {achievement.unlocked && (
        <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">
          ✨
        </Badge>
      )}
    </div>
  );
};

export default AchievementBadge;
