-- Add user_id column to existing profiles table to link with auth.users
ALTER TABLE public.profiles 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique constraint to ensure one profile per user
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Add fundaysSpent column if it doesn't exist (it was mentioned in types but may not be in DB)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' 
                   AND column_name = 'fundaysspent') THEN
        ALTER TABLE public.profiles ADD COLUMN fundaysSpent integer NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Update RLS policies for auth-based access
DROP POLICY IF EXISTS "Allow all operations on profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, user_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email, 'User'));
  RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();