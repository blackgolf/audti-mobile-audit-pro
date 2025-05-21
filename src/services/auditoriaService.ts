
import { supabase } from "@/integrations/supabase/client";
import { Auditoria, AuditoriaInput, AuditoriaUpdate } from "@/types/auditorias";

export const auditoriaService = {
  async create(auditoria: AuditoriaInput): Promise<Auditoria | null> {
    const { data, error } = await supabase
      .from("auditorias")
      .insert(auditoria)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<Auditoria[]> {
    const { data, error } = await supabase
      .from("auditorias")
      .select('*')
      .order('data', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<Auditoria | null> {
    const { data, error } = await supabase
      .from("auditorias")
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async update(id: string, updates: AuditoriaUpdate): Promise<Auditoria | null> {
    const { data, error } = await supabase
      .from("auditorias")
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("auditorias")
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }
};
