
import { supabase } from "@/integrations/supabase/client";

export interface ChecklistItem {
  id: string;
  area: string;
  descricao: string;
  ordem: number | null;
}

export const checklistService = {
  // Buscar todos os critérios
  getAll: async (): Promise<ChecklistItem[]> => {
    // Usamos any para contornar a limitação do tipo até que os tipos do Supabase sejam atualizados
    const { data, error } = await (supabase as any)
      .from('checklists')
      .select('*')
      .order('ordem', { ascending: true });
    
    if (error) {
      console.error("Erro ao buscar critérios:", error);
      throw error;
    }
    
    return data as ChecklistItem[];
  },
  
  // Buscar critérios por área
  getByAreas: async (areas: string[]): Promise<ChecklistItem[]> => {
    if (!areas.length) return [];
    
    // Usamos any para contornar a limitação do tipo até que os tipos do Supabase sejam atualizados
    const { data, error } = await (supabase as any)
      .from('checklists')
      .select('*')
      .in('area', areas)
      .order('ordem', { ascending: true });
    
    if (error) {
      console.error("Erro ao buscar critérios por área:", error);
      throw error;
    }
    
    return data as ChecklistItem[];
  }
};
