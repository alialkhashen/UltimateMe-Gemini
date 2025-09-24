-- Create user profiles table (simplified for local storage)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 0,
  reward_minutes INTEGER NOT NULL DEFAULT 0,
  funday_count INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  total_tasks INTEGER NOT NULL DEFAULT 0,
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  profile_image TEXT,
  user_name TEXT NOT NULL DEFAULT 'User',
  status TEXT NOT NULL DEFAULT 'Ready to achieve goals!',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  is_default BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('core', 'hard', 'mid', 'easy')),
  priority TEXT CHECK (priority IN ('important', 'high', 'moderate', 'low')),
  due_date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  repeat_days TEXT[] NOT NULL DEFAULT '{}',
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT false,
  time_remaining INTEGER NOT NULL DEFAULT 0,
  custom_color TEXT,
  custom_bar_color TEXT,
  notes TEXT,
  reward_points INTEGER,
  reward_time INTEGER,
  last_active_timestamp BIGINT,
  last_interaction_date DATE,
  is_scheduled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.profiles (id, user_name, status) VALUES 
('00000000-0000-0000-0000-000000000001', 'User', 'Ready to achieve goals!');

INSERT INTO public.groups (id, name, color, is_default, display_order) VALUES 
('00000000-0000-0000-0000-000000000001', 'Personal', '#3b82f6', true, 1),
('00000000-0000-0000-0000-000000000002', 'Work', '#10b981', false, 2),
('00000000-0000-0000-0000-000000000003', 'Health', '#f59e0b', false, 3),
('00000000-0000-0000-0000-000000000004', 'Completed Tasks', '#6b7280', false, 999);