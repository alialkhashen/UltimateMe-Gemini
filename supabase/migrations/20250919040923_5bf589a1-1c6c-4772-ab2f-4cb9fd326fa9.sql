-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create permissive policies since auth is disabled
CREATE POLICY "Allow all operations on profiles" 
ON public.profiles 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on groups" 
ON public.groups 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on tasks" 
ON public.tasks 
FOR ALL 
USING (true) 
WITH CHECK (true);