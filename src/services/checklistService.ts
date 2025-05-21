
import { supabase } from "@/integrations/supabase/client";

export interface ChecklistItem {
  id: string;
  area: string;
  descricao: string;
  obrigatoria: boolean;
  ordem: number | null;
  peso: number; // Required field
  created_at?: string | null;
  updated_at?: string | null;
}

// Helper function to ensure peso is defined
const ensurePeso = (item: any): ChecklistItem => ({
  ...item,
  peso: item.peso !== undefined ? item.peso : 3 // Default peso to 3 if undefined
});

export const checklistService = {
  // Recuperar todos os itens de checklist
  async getAll(): Promise<ChecklistItem[]> {
    const { data, error } = await supabase
      .from("checklists")
      .select("*")
      .order("area")
      .order("ordem");
    
    if (error) throw error;
    
    // Ensure peso is defined for all items
    return (data || []).map(item => ensurePeso(item));
  },
  
  // Recuperar áreas de checklists únicas
  async getAreas(): Promise<string[]> {
    const { data, error } = await supabase
      .from("checklists")
      .select("area")
      .order("area");
      
    if (error) throw error;
    
    // Extract unique areas
    const areas = new Set<string>();
    data?.forEach(item => areas.add(item.area));
    
    return Array.from(areas);
  },
  
  // Recuperar checklist por área(s)
  async getByAreas(areas: string[]): Promise<ChecklistItem[]> {
    if (!areas.length) return [];
    
    const { data, error } = await supabase
      .from("checklists")
      .select("*")
      .in("area", areas)
      .order("area")
      .order("ordem");
    
    if (error) throw error;
    
    // Ensure peso is defined for all items
    return (data || []).map(item => ensurePeso(item));
  },
  
  // Recuperar um item específico
  async getById(id: string): Promise<ChecklistItem | null> {
    const { data, error } = await supabase
      .from("checklists")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Ensure peso is defined
    return ensurePeso(data);
  },
  
  // Criar novo item de checklist
  async create(item: Omit<ChecklistItem, 'id'>): Promise<ChecklistItem | null> {
    const itemToInsert = {
      ...item,
      peso: item.peso !== undefined ? item.peso : 3 // Ensure peso is defined
    };
    
    const { data, error } = await supabase
      .from("checklists")
      .insert(itemToInsert)
      .select()
      .single();
    
    if (error) throw error;
    return data ? ensurePeso(data) : null;
  },
  
  // Criar vários itens de checklist de uma vez
  async createMany(items: Omit<ChecklistItem, 'id'>[]): Promise<ChecklistItem[] | null> {
    if (!items.length) return [];
    
    // Ensure peso is defined for all items
    const itemsToInsert = items.map(item => ({
      ...item,
      peso: item.peso !== undefined ? item.peso : 3 // Default peso to 3 if not present
    }));
    
    const { data, error } = await supabase
      .from("checklists")
      .insert(itemsToInsert)
      .select();
    
    if (error) throw error;
    return data ? data.map(item => ensurePeso(item)) : [];
  },
  
  // Atualizar item existente
  async update(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | null> {
    const { data, error } = await supabase
      .from("checklists")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? ensurePeso(data) : null;
  },
  
  // Remover item
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("checklists")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },
  
  // Remover todos os itens de uma área
  async deleteArea(area: string): Promise<void> {
    const { error } = await supabase
      .from("checklists")
      .delete()
      .eq("area", area);
    
    if (error) throw error;
  }
};
