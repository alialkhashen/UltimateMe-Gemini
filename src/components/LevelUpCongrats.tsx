
import { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LevelUpCongratsProps {
  newLevel: number;
  isVisible: boolean;
  onClose: () => void;
}

const LevelUpCongrats = ({ newLevel, isVisible, onClose }: LevelUpCongratsProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <div className="space-y-6 py-4">
          {/* Animated Trophy */}
          <div className={`relative flex justify-center ${showAnimation ? 'animate-bounce' : ''}`}>
            <div className="relative">
              <Trophy className="w-16 h-16 text-yellow-500" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              <Star className="w-4 h-4 text-yellow-400 absolute -bottom-1 -left-1 animate-pulse" />
            </div>
          </div>

          {/* Congratulations Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              🎉 Congratulations! 🎉
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              You've reached <span className="font-bold text-yellow-600 dark:text-yellow-400">Level {newLevel}</span>!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep up the amazing work!
            </p>
          </div>

          {/* Confetti Effect */}
          <div className="text-4xl animate-pulse">
            🎊 ✨ 🎊
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LevelUpCongrats;
