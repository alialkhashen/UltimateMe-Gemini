
import { useState } from 'react';
import { Gift, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import RewardTimerWindow from './RewardTimerWindow';

interface RewardTimerProps {
  rewardMinutes: number;
  onRewardUse: (minutesUsed: number) => void;
  onRewardReturn?: (minutesReturned: number) => void;
  onTimerComplete?: () => void;
  onResetTimer?: () => void;
  isAdminMode?: boolean;
  hasCompletedCoreTask?: boolean;
}

const RewardTimer = ({ 
  rewardMinutes, 
  onRewardUse, 
  onRewardReturn,
  onTimerComplete,
  onResetTimer,
  isAdminMode,
  hasCompletedCoreTask = false
}: RewardTimerProps) => {
  const [selectedMinutes, setSelectedMinutes] = useState(Math.min(15, Math.max(1, rewardMinutes)));
  const [activeRewardTimer, setActiveRewardTimer] = useState<number | null>(null);

  const startRewardTimer = () => {
    if (selectedMinutes > rewardMinutes || selectedMinutes <= 0 || rewardMinutes <= 0) return;
    
    setActiveRewardTimer(selectedMinutes);
    onRewardUse(selectedMinutes);
  };

  const useAllRewards = () => {
    if (rewardMinutes <= 0) return;
    
    setActiveRewardTimer(rewardMinutes);
    onRewardUse(rewardMinutes);
  };

  const closeRewardTimer = () => {
    setActiveRewardTimer(null);
  };

  const handleTimeReturn = (minutesReturned: number) => {
    console.log('Time returned:', minutesReturned);
    if (onRewardReturn) {
      onRewardReturn(minutesReturned);
    }
  };

  const handleTimeComplete = () => {
    if (onTimerComplete) {
      onTimerComplete();
    }
  };

  const resetTimer = () => {
    if (activeRewardTimer !== null) {
      setActiveRewardTimer(null);
    }
    if (onResetTimer) {
      onResetTimer();
    }
  };

  const formatTimeDisplay = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isNegative = rewardMinutes < 0;

  return (
    <div className="space-y-4">
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Reward Timer</CardTitle>
            </div>
            {isAdminMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={resetTimer}
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className={`text-sm ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {isNegative ? 'Penalty: ' : 'Available: '}
            {formatTimeDisplay(Math.abs(rewardMinutes))} {isNegative && '(in debt)'}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasCompletedCoreTask && rewardMinutes > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3 rounded-lg">
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                🔒 Complete 1 Core task to unlock reward minutes for today
              </p>
            </div>
          )}
          
          {rewardMinutes > 0 && hasCompletedCoreTask && (
            <>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Minutes: {selectedMinutes}</span>
                  <span className="text-xs text-gray-500">{formatTimeDisplay(selectedMinutes)}</span>
                </div>
                <Slider
                  value={[selectedMinutes]}
                  onValueChange={(value) => setSelectedMinutes(value[0])}
                  min={1}
                  max={rewardMinutes}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={startRewardTimer}
                  disabled={selectedMinutes <= 0 || selectedMinutes > rewardMinutes || activeRewardTimer !== null}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Start Timer
                </Button>
                <Button
                  onClick={useAllRewards}
                  disabled={rewardMinutes <= 0 || activeRewardTimer !== null}
                  variant="outline"
                  className="flex-1"
                >
                  Use All
                </Button>
              </div>
            </>
          )}

          {rewardMinutes <= 0 && (
            <div className={`text-center p-4 rounded-lg ${
              isNegative 
                ? 'bg-red-50 dark:bg-red-900/20' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <p className={`text-sm ${
                isNegative 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {isNegative 
                  ? '⚠️ You have penalty minutes! Complete tasks to earn back reward time.'
                  : 'Complete Core tasks first, then earn reward time! 🎁'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {activeRewardTimer && (
        <RewardTimerWindow 
          initialMinutes={activeRewardTimer} 
          onClose={closeRewardTimer}
          onTimeReturn={handleTimeReturn}
          onTimeComplete={handleTimeComplete}
        />
      )}
    </div>
  );
};

export default RewardTimer;
