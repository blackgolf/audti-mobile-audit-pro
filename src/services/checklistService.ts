
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

// Helper function to parse and format error messages
const handleError = (error: any) => {
  console.error("Checklist service error:", error);
  
  // Check for infinite recursion error in the message
  if (error.message && error.message.includes("infinite recursion detected")) {
    throw new Error("Erro de permissão no banco de dados. Por favor, verifique as políticas de segurança do Supabase ou entre em contato com o administrador.");
  }
  
  // Return the original error if it's not a recursion issue
  throw error;
};

export const checklistService = {
  // Recuperar todos os itens de checklist
  async getAll(): Promise<ChecklistItem[]> {
    try {
      const { data, error } = await supabase
        .from("checklists")
        .select("*")
        .order("area")
        .order("ordem");
      
      if (error) throw error;
      
      // Ensure peso is defined for all items
      return (data || []).map(item => ensurePeso(item));
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Recuperar áreas de checklists únicas
  async getAreas(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("checklists")
        .select("area")
        .order("area");
        
      if (error) throw error;
      
      // Extract unique areas
      const areas = new Set<string>();
      data?.forEach(item => areas.add(item.area));
      
      return Array.from(areas);
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Recuperar checklist por área(s)
  async getByAreas(areas: string[]): Promise<ChecklistItem[]> {
    try {
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
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Recuperar um item específico
  async getById(id: string): Promise<ChecklistItem | null> {
    try {
      const { data, error } = await supabase
        .from("checklists")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Ensure peso is defined
      return ensurePeso(data);
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Criar novo item de checklist
  async create(item: Omit<ChecklistItem, 'id'>): Promise<ChecklistItem | null> {
    try {
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
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Criar vários itens de checklist de uma vez
  async createMany(items: Omit<ChecklistItem, 'id'>[]): Promise<ChecklistItem[] | null> {
    try {
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
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Atualizar item existente
  async update(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | null> {
    try {
      const { data, error } = await supabase
        .from("checklists")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data ? ensurePeso(data) : null;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Remover item
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("checklists")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  },
  
  // Remover todos os itens de uma área
  async deleteArea(area: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("checklists")
        .delete()
        .eq("area", area);
      
      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  }
};
