import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Fetch all stats in parallel
      const [kpisResult, actionsResult, problemsResult, categoriesResult] = await Promise.all([
        supabase.from('kpis').select('status'),
        supabase.from('actions').select('status'),
        supabase.from('problems').select('status'),
        supabase.from('kpi_categories').select('id, code, name, color'),
      ]);

      if (kpisResult.error) throw kpisResult.error;
      if (actionsResult.error) throw actionsResult.error;
      if (problemsResult.error) throw problemsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      const kpis = kpisResult.data || [];
      const actions = actionsResult.data || [];
      const problems = problemsResult.data || [];

      // Calculate KPI stats
      const kpiStats = {
        total: kpis.length,
        success: kpis.filter(k => k.status === 'green').length,
        warning: kpis.filter(k => k.status === 'orange').length,
        danger: kpis.filter(k => k.status === 'red').length,
      };

      // Calculate action stats
      const actionStats = {
        total: actions.length,
        todo: actions.filter(a => a.status === 'todo').length,
        inProgress: actions.filter(a => a.status === 'in_progress').length,
        done: actions.filter(a => a.status === 'done').length,
      };

      // Calculate problem stats
      const problemStats = {
        total: problems.length,
        open: problems.filter(p => p.status === 'open').length,
        inProgress: problems.filter(p => p.status === 'in_progress').length,
        resolved: problems.filter(p => p.status === 'resolved').length,
      };

      return {
        kpis: kpiStats,
        actions: actionStats,
        problems: problemStats,
        categories: categoriesResult.data,
      };
    },
  });
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ['category-stats'],
    queryFn: async () => {
      const { data: categories, error: catError } = await supabase
        .from('kpi_categories')
        .select('id, code, name, color')
        .order('display_order');

      if (catError) throw catError;

      const { data: kpis, error: kpiError } = await supabase
        .from('kpis')
        .select('category_id, status');

      if (kpiError) throw kpiError;

      return categories?.map(cat => {
        const categoryKPIs = kpis?.filter(k => k.category_id === cat.id) || [];
        return {
          ...cat,
          success: categoryKPIs.filter(k => k.status === 'green').length,
          warning: categoryKPIs.filter(k => k.status === 'orange').length,
          danger: categoryKPIs.filter(k => k.status === 'red').length,
          total: categoryKPIs.length,
        };
      }) || [];
    },
  });
}
