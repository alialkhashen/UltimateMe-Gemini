import { useState } from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RewardTimerTopBarProps {
  rewardMinutes: number;
  onRewardUse: (minutesUsed: number) => void;
  hasCompletedCoreTask: boolean;
}

const RewardTimerTopBar = ({ rewardMinutes, onRewardUse, hasCompletedCoreTask }: RewardTimerTopBarProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(Math.min(30, Math.max(1, rewardMinutes)));

  const formatTimeDisplay = (totalMinutes: number) => {
    const hours = Math.floor(Math.abs(totalMinutes) / 60);
    const minutes = Math.abs(totalMinutes) % 60;
    const sign = totalMinutes < 0 ? '-' : '';
    
    return `${sign}${hours}h ${minutes}m`;
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasCompletedCoreTask) {
      return; // Don't show popup if no core task completed
    }
    setShowPopup(true);
    setSelectedMinutes(Math.min(30, Math.max(1, rewardMinutes)));
  };

  const handleLeftClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Do nothing on left click
  };

  const handleUse = () => {
    onRewardUse(selectedMinutes);
    setShowPopup(false);
  };

  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
              onContextMenu={handleRightClick}
              onClick={handleLeftClick}
            >
              <Timer className={`w-4 h-4 ${
                rewardMinutes < 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : rewardMinutes > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300'
              }`} />
              <span className={`text-sm font-medium ${
                rewardMinutes < 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : rewardMinutes > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300'
              }`}>
                {formatTimeDisplay(rewardMinutes)}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{hasCompletedCoreTask ? 'Right-click to use reward time' : 'You need to finish 1 core task at least to unlock the reward timer today'}</p>
          </TooltipContent>
        </Tooltip>

        {showPopup && rewardMinutes > 0 && hasCompletedCoreTask && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowPopup(false)}
            />
            <Card className="absolute top-full right-0 mt-2 w-64 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 dark:text-white">Use Reward Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                    Select minutes to use: {selectedMinutes}
                  </Label>
                  <Slider
                    value={[selectedMinutes]}
                    onValueChange={(value) => setSelectedMinutes(value[0])}
                    max={rewardMinutes}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUse} 
                    className="flex-1"
                    disabled={rewardMinutes <= 0}
                  >
                    Use
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPopup(false)} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

export default RewardTimerTopBar;