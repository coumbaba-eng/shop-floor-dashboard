-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'team_leader', 'operator');

-- 2. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'operator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- 4. Create KPI categories table
CREATE TABLE public.kpi_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 5. Create workstations table
CREATE TABLE public.workstations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance', 'offline')),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 6. Create KPIs table
CREATE TABLE public.kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.kpi_categories(id) ON DELETE SET NULL,
  workstation_id UUID REFERENCES public.workstations(id) ON DELETE SET NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  target_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  status TEXT DEFAULT 'green' CHECK (status IN ('green', 'orange', 'red')),
  trend TEXT DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 7. Create KPI history table
CREATE TABLE public.kpi_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES public.kpis(id) ON DELETE CASCADE NOT NULL,
  value NUMERIC NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 8. Create actions table
CREATE TABLE public.actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  category_id UUID REFERENCES public.kpi_categories(id) ON DELETE SET NULL,
  workstation_id UUID REFERENCES public.workstations(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 9. Create problems table
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  category_id UUID REFERENCES public.kpi_categories(id) ON DELETE SET NULL,
  workstation_id UUID REFERENCES public.workstations(id) ON DELETE SET NULL,
  is_escalated BOOLEAN DEFAULT false,
  escalated_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 10. Create notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  related_type TEXT CHECK (related_type IN ('kpi', 'action', 'problem', 'workstation')),
  related_id UUID,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 11. Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'critical')),
  is_read BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workstations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1 
      WHEN 'manager' THEN 2 
      WHEN 'team_leader' THEN 3 
      WHEN 'operator' THEN 4 
    END
  LIMIT 1
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Assign default operator role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'operator');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_workstations_updated_at BEFORE UPDATE ON public.workstations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON public.kpis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON public.actions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON public.problems FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies

-- Profiles: Users can read all profiles, update only their own
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- User roles: Only admins can manage, all authenticated can view
CREATE POLICY "Roles viewable by authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- KPI categories: Readable by all, manageable by admin/manager
CREATE POLICY "Categories viewable by all" ON public.kpi_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert categories" ON public.kpi_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins can update categories" ON public.kpi_categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins can delete categories" ON public.kpi_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Workstations: Readable by all, manageable by admin/manager
CREATE POLICY "Workstations viewable by all" ON public.workstations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins/managers can insert workstations" ON public.workstations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins/managers can update workstations" ON public.workstations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins can delete workstations" ON public.workstations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- KPIs: Readable by all, manageable by admin/manager/team_leader
CREATE POLICY "KPIs viewable by all" ON public.kpis FOR SELECT TO authenticated USING (true);
CREATE POLICY "KPIs insertable by leaders" ON public.kpis FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'team_leader'));
CREATE POLICY "KPIs updatable by leaders" ON public.kpis FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'team_leader'));
CREATE POLICY "KPIs deletable by admins" ON public.kpis FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

-- KPI history: Readable by all, insertable by authenticated
CREATE POLICY "KPI history viewable by all" ON public.kpi_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can record KPI values" ON public.kpi_history FOR INSERT TO authenticated WITH CHECK (true);

-- Actions: Readable by all, manageable based on role
CREATE POLICY "Actions viewable by all" ON public.actions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Actions creatable by team leaders and above" ON public.actions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'team_leader'));
CREATE POLICY "Actions updatable by assignee or leaders" ON public.actions FOR UPDATE TO authenticated USING (auth.uid() = assigned_to OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'team_leader'));
CREATE POLICY "Actions deletable by managers" ON public.actions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

-- Problems: Readable by all, creatable by all, manageable by leaders
CREATE POLICY "Problems viewable by all" ON public.problems FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can report problems" ON public.problems FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Problems updatable by reporter or leaders" ON public.problems FOR UPDATE TO authenticated USING (auth.uid() = reported_by OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'team_leader'));
CREATE POLICY "Problems deletable by managers" ON public.problems FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

-- Notes: Viewable by all, creatable by all, updatable by creator
CREATE POLICY "Notes viewable by all" ON public.notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create notes" ON public.notes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Creator can update notes" ON public.notes FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creator or admin can delete notes" ON public.notes FOR DELETE TO authenticated USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Alerts: Users can only see their own alerts
CREATE POLICY "Users see own alerts" ON public.alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can create alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own alerts" ON public.alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.alerts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Insert default SFM categories
INSERT INTO public.kpi_categories (code, name, color, icon, display_order) VALUES
  ('S', 'Sécurité', '#ef4444', 'Shield', 1),
  ('Q', 'Qualité', '#3b82f6', 'CheckCircle', 2),
  ('L', 'Livraison', '#8b5cf6', 'Truck', 3),
  ('C', 'Coût', '#f59e0b', 'DollarSign', 4),
  ('P', 'Performance', '#10b981', 'TrendingUp', 5),
  ('H', 'Humain', '#ec4899', 'Users', 6),
  ('E', 'Environnement', '#14b8a6', 'Leaf', 7),
  ('W', 'Poste de travail', '#6366f1', 'Settings', 8);