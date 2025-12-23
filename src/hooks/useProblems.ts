import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Problem = Tables<'problems'> & {
  category?: Tables<'kpi_categories'> | null;
  workstation?: Tables<'workstations'> | null;
};

export function useProblems(filters?: { status?: string; categoryCode?: string; severity?: string }) {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: async () => {
      let query = supabase
        .from('problems')
        .select(`
          *,
          category:kpi_categories(*),
          workstation:workstations(*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
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
      return data as Problem[];
    },
  });
}

export function useOpenProblems() {
  return useQuery({
    queryKey: ['problems', 'open'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          category:kpi_categories(*)
        `)
        .neq('status', 'resolved')
        .order('is_escalated', { ascending: false })
        .order('severity', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Problem[];
    },
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (problem: TablesInsert<'problems'>) => {
      const { data, error } = await supabase
        .from('problems')
        .insert(problem)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'problems'> & { id: string }) => {
      const { data, error } = await supabase
        .from('problems')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}
