-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
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

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid()::text);

-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  is_default BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Create policies for groups
CREATE POLICY "Users can view their own groups" 
ON public.groups 
FOR SELECT 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create their own groups" 
ON public.groups 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own groups" 
ON public.groups 
FOR UPDATE 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own groups" 
ON public.groups 
FOR DELETE 
USING (user_id = auth.uid()::text);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('core', 'hard', 'mid', 'easy')),
  priority TEXT CHECK (priority IN ('important', 'high', 'moderate', 'low')),
  due_date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  repeat_days TEXT[] NOT NULL DEFAULT '{}',
  group_id UUID NOT NULL,
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

-- Enable RLS on tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks" 
ON public.tasks 
FOR SELECT 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create their own tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own tasks" 
ON public.tasks 
FOR UPDATE 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own tasks" 
ON public.tasks 
FOR DELETE 
USING (user_id = auth.uid()::text);

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