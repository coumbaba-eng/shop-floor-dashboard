import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type KPICategory = Tables<'kpi_categories'>;

export function useKPICategories() {
  return useQuery({
    queryKey: ['kpi-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as KPICategory[];
    },
  });
}

export function useCategoryByCode(code: string) {
  const { data: categories } = useKPICategories();
  return categories?.find(c => c.code === code);
}
