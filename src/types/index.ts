export interface Group {

  id: string;

  name: string;

  color: string;

  icon?: string;

  isDefault?: boolean;

  displayOrder?: number;

}



export interface Task {

  id: string;

  name: string;

  level: 'core' | 'hard' | 'mid' | 'easy';

  priority?: 'important' | 'high' | 'moderate' | 'low';

  dueDate: string;

  duration: number; // in minutes

  repeatDays: string[];

  groupId: string;

  isCompleted: boolean;

  isActive: boolean;

  timeRemaining: number;

  customColor?: string;

  customBarColor?: string;

  createdAt: string;

  notes?: string;

  rewardPoints?: number;

  rewardTime?: number;

  lastActiveTimestamp?: number;

  lastInteractionDate?: string;

  isScheduled?: boolean; // For calendar preview of scheduled tasks

}



export interface UserStats {

  level: number;

  points: number;

  rewardMinutes: number;

  fundayCount: number;

  fundaysSpent: number; // Track how many fundays have been spent

  currentStreak: number;

  totalTasks: number;

  completedTasks: number;

  profileImage: string | null;

  userName: string;

  status: string;

}



export const TASK_REWARDS = {

  core: { minutes: 45, points: 25 },

  hard: { minutes: 20, points: 10 },

  mid: { minutes: 10, points: 5 },

  easy: { minutes: 5, points: 2 }

};



export const LEVEL_COLORS = {

  core: '#8b5cf6', // purple

  hard: '#ef4444', // red

  mid: '#eab308', // yellow

  easy: '#22c55e' // green

};



export const PRIORITY_COLORS = {

  important: '#dc2626', // red-600

  high: '#ea580c', // orange-600

  moderate: '#ca8a04', // yellow-600

  low: '#16a34a' // green-600

};