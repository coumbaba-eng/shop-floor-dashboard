import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Workstation = Tables<'workstations'>;

export function useWorkstations() {
  return useQuery({
    queryKey: ['workstations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workstations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Workstation[];
    },
  });
}

export function useWorkstationWithKPIs(workstationId: string) {
  return useQuery({
    queryKey: ['workstation', workstationId],
    queryFn: async () => {
      const { data: workstation, error: wsError } = await supabase
        .from('workstations')
        .select('*')
        .eq('id', workstationId)
        .maybeSingle();

      if (wsError) throw wsError;

      const { data: kpis, error: kpiError } = await supabase
        .from('kpis')
        .select(`
          *,
          category:kpi_categories(*)
        `)
        .eq('workstation_id', workstationId);

      if (kpiError) throw kpiError;

      return { ...workstation, kpis };
    },
    enabled: !!workstationId,
  });
}

export function useCreateWorkstation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workstation: TablesInsert<'workstations'>) => {
      const { data, error } = await supabase
        .from('workstations')
        .insert(workstation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workstations'] });
    },
  });
}

export function useUpdateWorkstation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'workstations'> & { id: string }) => {
      const { data, error } = await supabase
        .from('workstations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workstations'] });
    },
  });
}

export function useDeleteWorkstation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workstations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workstations'] });
    },
  });
}
