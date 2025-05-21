
import { supabase } from "@/integrations/supabase/client";
import { Auditoria, AuditoriaInput, AuditoriaUpdate } from "@/types/auditorias";
import { Json } from "@/integrations/supabase/types";

export const auditoriaService = {
  async create(auditoria: AuditoriaInput): Promise<Auditoria | null> {
    // Convertemos o objeto para o formato esperado pelo Supabase
    const { data, error } = await supabase
      .from("auditorias")
      .insert({
        titulo: auditoria.titulo,
        descricao: auditoria.descricao,
        data: auditoria.data,
        auditor: auditoria.auditor,
        areas: auditoria.areas,
        criterios: auditoria.criterios as unknown as Json
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    // Convertemos o resultado de volta para o formato do frontend
    return data ? {
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao,
      data: data.data,
      auditor: data.auditor,
      areas: data.areas,
      criterios: data.criterios as unknown as Auditoria["criterios"]
    } : null;
  },

  async getAll(): Promise<Auditoria[]> {
    const { data, error } = await supabase
      .from("auditorias")
      .select('*')
      .order('data', { ascending: false });
    
    if (error) throw new Error(error.message);
    // Convertemos cada item do resultado para o formato do frontend
    return data ? data.map(item => ({
      id: item.id,
      titulo: item.titulo,
      descricao: item.descricao,
      data: item.data,
      auditor: item.auditor,
      areas: item.areas,
      criterios: item.criterios as unknown as Auditoria["criterios"]
    })) : [];
  },

  async getById(id: string): Promise<Auditoria | null> {
    const { data, error } = await supabase
      .from("auditorias")
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    // Convertemos o resultado para o formato do frontend
    return data ? {
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao,
      data: data.data,
      auditor: data.auditor,
      areas: data.areas,
      criterios: data.criterios as unknown as Auditoria["criterios"]
    } : null;
  },

  async update(id: string, updates: AuditoriaUpdate): Promise<Auditoria | null> {
    // Convertemos o objeto para o formato esperado pelo Supabase
    const supabaseUpdates: Record<string, any> = {};
    
    if (updates.titulo !== undefined) supabaseUpdates.titulo = updates.titulo;
    if (updates.descricao !== undefined) supabaseUpdates.descricao = updates.descricao;
    if (updates.data !== undefined) supabaseUpdates.data = updates.data;
    if (updates.auditor !== undefined) supabaseUpdates.auditor = updates.auditor;
    if (updates.areas !== undefined) supabaseUpdates.areas = updates.areas;
    if (updates.criterios !== undefined) supabaseUpdates.criterios = updates.criterios as unknown as Json;
    
    const { data, error } = await supabase
      .from("auditorias")
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    // Convertemos o resultado para o formato do frontend
    return data ? {
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao,
      data: data.data,
      auditor: data.auditor,
      areas: data.areas,
      criterios: data.criterios as unknown as Auditoria["criterios"]
    } : null;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("auditorias")
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }
};
