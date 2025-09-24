import { useState, useEffect } from 'react';

export interface GoalStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface CustomGoal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate?: string;
  isCompleted: boolean;
  steps: GoalStep[];
  notes: string;
  rewardPoints: number;
  rewardMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export const useCustomGoals = () => {
  const [goals, setGoals] = useState<CustomGoal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    // Using local storage for now since auth is disabled
    try {
      const storedGoals = localStorage.getItem('customGoals');
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Error fetching custom goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (newGoal: Omit<CustomGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const goal: CustomGoal = {
        ...newGoal,
        id: `goal_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedGoals = [goal, ...goals];
      setGoals(updatedGoals);
      localStorage.setItem('customGoals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error creating custom goal:', error);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<CustomGoal>) => {
    try {
      const updatedGoals = goals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates, updatedAt: new Date().toISOString() } : goal
      );
      setGoals(updatedGoals);
      localStorage.setItem('customGoals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error updating custom goal:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      localStorage.setItem('customGoals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error deleting custom goal:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};