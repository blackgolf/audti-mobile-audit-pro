
import { supabase } from "@/integrations/supabase/client";

export interface ChecklistItem {
  id: string;
  area: string;
  descricao: string;
  obrigatoria: boolean;
  ordem: number | null;
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
  
  // Criar novo item de checklist (admin only)
  async create(item: Omit<ChecklistItem, 'id'>): Promise<ChecklistItem | null> {
    const { data, error } = await supabase
      .from("checklists")
      .insert(item)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
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
  }
};
