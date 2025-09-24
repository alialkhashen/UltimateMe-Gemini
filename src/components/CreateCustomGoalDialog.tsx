import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Check } from 'lucide-react';

interface GoalStep {
  id: string;
  text: string;
  completed: boolean;
}

interface CustomGoal {
  id: string;
  name: string;
  rewardPoints: number;
  rewardMinutes: number;
  requirement: string;
  notes: string;
  completed: boolean;
  steps: GoalStep[];
  createdAt: string;
}

interface CreateCustomGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreate: (goal: CustomGoal) => void;
  onGoalEdit?: (goal: CustomGoal) => void;
  editingGoal?: CustomGoal | null;
}

const CreateCustomGoalDialog = ({ 
  isOpen, 
  onClose, 
  onGoalCreate, 
  onGoalEdit,
  editingGoal 
}: CreateCustomGoalDialogProps) => {
  const [goalName, setGoalName] = useState('');
  const [rewardPoints, setRewardPoints] = useState(10);
  const [rewardValue, setRewardValue] = useState(30);
  const [rewardUnit, setRewardUnit] = useState<'minutes' | 'hours'>('minutes');
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState<GoalStep[]>([]);
  const [newStepText, setNewStepText] = useState('');
  const goalIcons = [
    '📝', '💼', '🏃', '🎯', '📚', '💡', '🎨', '🍕', '🏠', '🎵', '⚽', '💪', '🌟', '🔥', '💎', '🚀',
    '📱', '💻', '🎮', '📺', '🍔', '☕', '🎈', '🎉', '🎊', '🎁', '🏆', '🥇', '🎖️', '🏅', '🎭', '🎪',
    '🎨', '🖼️', '📸', '🎬', '🎤', '🎧', '🎹', '🎸', '🥁', '🎺', '🎻', '🎼', '🎵', '🎶', '🎯', '🎲',
    '🎳', '🎮', '🕹️', '🎰', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '⛳', '🏁',
    '🏃‍♂️', '🏃‍♀️', '🤸‍♂️', '🤸‍♀️', '🏋️‍♂️', '🏋️‍♀️', '🚴‍♂️', '🚴‍♀️', '🤽‍♂️', '🤽‍♀️', '🏊‍♂️', '🏊‍♀️', '⛷️', '🏂', '🏄‍♂️', '🏄‍♀️',
    '🧘‍♂️', '🧘‍♀️', '🏇', '🏌️‍♂️', '🏌️‍♀️', '🤺', '🤼‍♂️', '🤼‍♀️', '🤹‍♂️', '🤹‍♀️', '🧗‍♂️', '🧗‍♀️', '🚵‍♂️', '🚵‍♀️', '🏎️', '🏍️',
    '🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🍈', '🍉', '🍑', '🍒', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔',
    '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯',
    '🧇', '🥞', '🧈', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧋', '🧃', '🥤', '🧊', '🍺', '🍻', '🥂',
    '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🥢', '🏺', '🌍', '🌎', '🌏', '🌐', '🗺️',
    '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠',
    '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼',
    '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇',
    '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊',
    '🚝', '🚞', '🚋', '🚌', '🚍', '🎫', '🎟️', '🎠', '🎡', '🎢', '🎪'
  ];

  useEffect(() => {
    if (editingGoal) {
      setGoalName(editingGoal.name);
      setRewardPoints(editingGoal.rewardPoints);
      setNotes(editingGoal.notes);
      setSteps(editingGoal.steps || []);
      
      // Convert minutes to appropriate unit
      if (editingGoal.rewardMinutes >= 60 && editingGoal.rewardMinutes % 60 === 0) {
        setRewardValue(editingGoal.rewardMinutes / 60);
        setRewardUnit('hours');
      } else {
        setRewardValue(editingGoal.rewardMinutes);
        setRewardUnit('minutes');
      }
    } else {
      resetForm();
    }
  }, [editingGoal, isOpen]);

  const getRewardMinutes = () => {
    return rewardUnit === 'hours' ? rewardValue * 60 : rewardValue;
  };

  const addStep = () => {
    if (!newStepText.trim()) return;
    
    const newStep: GoalStep = {
      id: `step-${Date.now()}`,
      text: newStepText.trim(),
      completed: false
    };
    
    setSteps(prev => [...prev, newStep]);
    setNewStepText('');
  };

  const removeStep = (stepId: string) => {
    setSteps(prev => prev.filter(step => step.id !== stepId));
  };

  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const getCompletionPercentage = () => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const handleSubmit = () => {
    if (!goalName.trim()) return;

    const goalData = {
      name: goalName.trim(),
      rewardPoints,
      rewardMinutes: getRewardMinutes(),
      requirement: '', // Remove this field as it's no longer needed
      notes: notes.trim(),
      completed: editingGoal?.completed || false,
      steps
    };

    if (editingGoal && onGoalEdit) {
      onGoalEdit({
        ...editingGoal,
        ...goalData
      });
    } else {
      onGoalCreate({
        ...goalData,
        id: `custom-goal-${Date.now()}`,
        createdAt: new Date().toISOString()
      });
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setGoalName('');
    setRewardPoints(10);
    setRewardValue(30);
    setRewardUnit('minutes');
    setNotes('');
    setSteps([]);
    setNewStepText('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingGoal ? 'Edit Custom Goal' : 'Create Custom Goal'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="goalName">Goal Name</Label>
            <Input
              id="goalName"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="Enter goal name"
            />
          </div>

          <div>
            <Label htmlFor="rewardPoints">Reward Points</Label>
            <Input
              id="rewardPoints"
              type="number"
              value={rewardPoints}
              onChange={(e) => setRewardPoints(parseInt(e.target.value) || 0)}
              min="1"
              max="1000"
            />
          </div>

          <div>
            <Label>Reward Time</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={rewardValue}
                onChange={(e) => setRewardValue(parseInt(e.target.value) || 0)}
                min="1"
                max={rewardUnit === 'hours' ? 8 : 480}
                className="flex-1"
              />
              <Select value={rewardUnit} onValueChange={(value: 'minutes' | 'hours') => setRewardUnit(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total: {getRewardMinutes()} minutes
            </p>
          </div>

          <div>
            <Label>Steps to Complete Goal</Label>
            {steps.length > 0 && (
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Progress: {getCompletionPercentage()}% ({steps.filter(s => s.completed).length}/{steps.length} steps completed)
              </div>
            )}
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2 p-2 border rounded">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {step.completed && <Check className="w-3 h-3" />}
                  </button>
                  <span className={`flex-1 text-sm ${step.completed ? 'line-through text-gray-500' : ''}`}>
                    {step.text}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(step.id)}
                    className="flex-shrink-0 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a new step..."
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStep()}
                className="flex-1"
              />
              <Button type="button" onClick={addStep} size="sm" disabled={!newStepText.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or motivation"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!goalName.trim()} 
              className="flex-1"
            >
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomGoalDialog;
