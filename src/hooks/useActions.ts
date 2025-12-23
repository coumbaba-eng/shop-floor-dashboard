import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Action = Tables<'actions'> & {
  category?: Tables<'kpi_categories'> | null;
  workstation?: Tables<'workstations'> | null;
  assignee_profile?: Tables<'profiles'> | null;
};

export function useActions(filters?: { status?: string; categoryCode?: string; priority?: string }) {
  return useQuery({
    queryKey: ['actions', filters],
    queryFn: async () => {
      let query = supabase
        .from('actions')
        .select(`
          *,
          category:kpi_categories(*),
          workstation:workstations(*)
        `)
        .order('due_date', { ascending: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.categoryCode) {
        const { data: category } = await supabase
          .from('kpi_categories')
          .select('id')
          .eq('code', filters.categoryCode)
          .maybeSingle();
        
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Action[];
    },
  });
}

export function useTodayActions() {
  return useQuery({
    queryKey: ['actions', 'today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('actions')
        .select(`
          *,
          category:kpi_categories(*)
        `)
        .or(`due_date.eq.${today},priority.eq.high`)
        .neq('status', 'done')
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as Action[];
    },
  });
}

export function useCreateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: TablesInsert<'actions'>) => {
      const { data, error } = await supabase
        .from('actions')
        .insert(action)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    },
  });
}

export function useUpdateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'actions'> & { id: string }) => {
      const { data, error } = await supabase
        .from('actions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    },
  });
}

export function useDeleteAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('actions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    },
  });
}
