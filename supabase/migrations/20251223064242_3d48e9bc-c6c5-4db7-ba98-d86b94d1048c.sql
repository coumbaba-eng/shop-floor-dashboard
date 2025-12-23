-- Update handle_new_user function to assign roles based on test emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  assigned_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Determine role based on email
  CASE 
    WHEN NEW.email = 'admin@sfm.test' THEN assigned_role := 'admin';
    WHEN NEW.email = 'manager@sfm.test' THEN assigned_role := 'manager';
    WHEN NEW.email = 'leader@sfm.test' THEN assigned_role := 'team_leader';
    ELSE assigned_role := 'operator';
  END CASE;
  
  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);
  
  RETURN NEW;
END;
$$;

-- Create trigger if not exists (drop and recreate to be safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();