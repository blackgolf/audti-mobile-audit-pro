
import { supabase } from "@/integrations/supabase/client";

export interface ChecklistItem {
  id: string;
  area: string;
  descricao: string;
  obrigatoria: boolean;
  ordem: number | null;
  peso: number; // Changed from optional to required
  created_at?: string | null;
  updated_at?: string | null;
}

export const checklistService = {
  // Recuperar todos os itens de checklist
  async getAll(): Promise<ChecklistItem[]> {
    const { data, error } = await supabase
      .from("checklists")
      .select("*")
      .order("area")
      .order("ordem");
    
    if (error) throw new Error(error.message);
    
    // Ensure peso is defined for all items
    return (data || []).map(item => ({
      ...item,
      peso: item.peso ?? 3, // Default peso to 3 if not present
    }));
  },
  
  // Recuperar áreas de checklists únicas
  async getAreas(): Promise<string[]> {
    const { data, error } = await supabase
      .from("checklists")
      .select("area")
      .order("area");
      
    if (error) throw new Error(error.message);
    
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
    
    if (error) throw new Error(error.message);
    
    // Ensure peso is defined for all items
    return (data || []).map(item => ({
      ...item,
      peso: item.peso ?? 3, // Default peso to 3 if not present
    }));
  },
  
  // Recuperar um item específico
  async getById(id: string): Promise<ChecklistItem | null> {
    const { data, error } = await supabase
      .from("checklists")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    
    if (!data) return null;
    
    // Ensure peso is defined
    return {
      ...data,
      peso: data.peso ?? 3, // Default peso to 3 if not present
    };
  },
  
  // Criar novo item de checklist
  async create(item: Omit<ChecklistItem, 'id'>): Promise<ChecklistItem | null> {
    const itemToInsert = {
      ...item,
      peso: item.peso ?? 3 // Ensure peso is defined
    };
    
    const { data, error } = await supabase
      .from("checklists")
      .insert(itemToInsert)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data ? { ...data, peso: data.peso ?? 3 } : null;
  },
  
  // Criar vários itens de checklist de uma vez
  async createMany(items: Omit<ChecklistItem, 'id'>[]): Promise<ChecklistItem[] | null> {
    if (!items.length) return [];
    
    // Ensure peso is defined for all items
    const itemsToInsert = items.map(item => ({
      ...item,
      peso: item.peso ?? 3 // Default peso to 3 if not present
    }));
    
    const { data, error } = await supabase
      .from("checklists")
      .insert(itemsToInsert)
      .select();
    
    if (error) throw new Error(error.message);
    return data ? data.map(item => ({ ...item, peso: item.peso ?? 3 })) : [];
  },
  
  // Atualizar item existente
  async update(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | null> {
    const { data, error } = await supabase
      .from("checklists")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data ? { ...data, peso: data.peso ?? 3 } : null;
  },
  
  // Remover item
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("checklists")
      .delete()
      .eq("id", id);
    
    if (error) throw new Error(error.message);
  },
  
  // Remover todos os itens de uma área
  async deleteArea(area: string): Promise<void> {
    const { error } = await supabase
      .from("checklists")
      .delete()
      .eq("area", area);
    
    if (error) throw new Error(error.message);
  }
};
