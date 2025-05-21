
import { supabase } from "@/integrations/supabase/client";

export interface ChecklistItem {
  id: string;
  area: string;
  descricao: string;
  obrigatoria: boolean;
  ordem: number | null;
  peso?: number; // Adicionando campo de peso para as perguntas
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
    return data || [];
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
    return data || [];
  },
  
  // Recuperar um item específico
  async getById(id: string): Promise<ChecklistItem | null> {
    const { data, error } = await supabase
      .from("checklists")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data;
  },
  
  // Criar novo item de checklist
  async create(item: Omit<ChecklistItem, 'id'>): Promise<ChecklistItem | null> {
    const { data, error } = await supabase
      .from("checklists")
      .insert(item)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },
  
  // Criar vários itens de checklist de uma vez
  async createMany(items: Omit<ChecklistItem, 'id'>[]): Promise<ChecklistItem[] | null> {
    if (!items.length) return [];
    
    const { data, error } = await supabase
      .from("checklists")
      .insert(items)
      .select();
    
    if (error) throw new Error(error.message);
    return data || [];
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
    return data;
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
