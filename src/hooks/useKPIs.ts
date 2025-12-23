import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type KPI = Tables<'kpis'> & {
  category?: Tables<'kpi_categories'> | null;
  workstation?: Tables<'workstations'> | null;
  history?: Tables<'kpi_history'>[];
};

export function useKPIs(categoryCode?: string) {
  return useQuery({
    queryKey: ['kpis', categoryCode],
    queryFn: async () => {
      let query = supabase
        .from('kpis')
        .select(`
          *,
          category:kpi_categories(*),
          workstation:workstations(*)
        `)
        .order('created_at', { ascending: false });

      if (categoryCode) {
        const { data: category } = await supabase
          .from('kpi_categories')
          .select('id')
          .eq('code', categoryCode)
          .maybeSingle();
        
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as KPI[];
    },
  });
}

export function useKPIWithHistory(kpiId: string) {
  return useQuery({
    queryKey: ['kpi', kpiId, 'history'],
    queryFn: async () => {
      const { data: kpi, error: kpiError } = await supabase
        .from('kpis')
        .select(`
          *,
          category:kpi_categories(*),
          workstation:workstations(*)
        `)
        .eq('id', kpiId)
        .maybeSingle();

      if (kpiError) throw kpiError;

      const { data: history, error: historyError } = await supabase
        .from('kpi_history')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('recorded_at', { ascending: true })
        .limit(30);

      if (historyError) throw historyError;

      return { ...kpi, history } as KPI;
    },
    enabled: !!kpiId,
  });
}

export function useCreateKPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kpi: TablesInsert<'kpis'>) => {
      const { data, error } = await supabase
        .from('kpis')
        .insert(kpi)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    },
  });
}

export function useUpdateKPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'kpis'> & { id: string }) => {
      const { data, error } = await supabase
        .from('kpis')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    },
  });
}

export function useDeleteKPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('kpis')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    },
  });
}

// Helper to map DB status to UI status
export function getKPIStatusColor(status: string | null): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'green': return 'success';
    case 'orange': return 'warning';
    case 'red': return 'danger';
    default: return 'success';
  }
}

export function getKPITrendIcon(trend: string | null): 'up' | 'down' | 'stable' {
  switch (trend) {
    case 'up': return 'up';
    case 'down': return 'down';
    default: return 'stable';
  }
}
