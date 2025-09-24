
import { useState, useEffect } from 'react';
import { Pause, Play, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RewardTimerWindowProps {
  initialMinutes: number;
  onClose: () => void;
  onTimeComplete?: () => void;
  onTimeReturn?: (minutesRemaining: number) => void;
}

const RewardTimerWindow = ({ 
  initialMinutes, 
  onClose, 
  onTimeComplete,
  onTimeReturn 
}: RewardTimerWindowProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [totalTime] = useState(initialMinutes * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsRunning(false);
            if (onTimeComplete) {
              onTimeComplete();
            }
            // Auto-close after 3 seconds when timer completes
            setTimeout(() => {
              onClose();
            }, 3000);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, onTimeComplete, onClose]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeRemaining(totalTime);
    setIsRunning(false);
  };

  const handleClose = () => {
    if (timeRemaining > 0 && onTimeReturn) {
      const minutesRemaining = Math.ceil(timeRemaining / 60);
      onTimeReturn(minutesRemaining);
    }
    onClose();
  };

  return (
    <Card className="w-full max-w-sm mx-auto animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">🎁 Reward Time Active</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400 mb-4">
            {formatTime(timeRemaining)}
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
            <div
              className="h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {timeRemaining > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={toggleTimer}
              className="flex-1"
            >
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetTimer}
              className="px-3"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        )}

        {timeRemaining === 0 && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-700 dark:text-green-300 font-semibold">
              🎉 Reward time completed! Enjoy your break! 🎉
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              This window will close automatically...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RewardTimerWindow;
