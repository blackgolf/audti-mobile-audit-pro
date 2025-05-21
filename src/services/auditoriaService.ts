
import { supabase } from "@/integrations/supabase/client";
import { Auditoria, AuditoriaInput, AuditoriaUpdate } from "@/types/auditorias";
import { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

export const auditoriaService = {
  async create(auditoria: AuditoriaInput): Promise<Auditoria | null> {
    // Obtemos o usuário atual através do supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Convertemos o objeto para o formato esperado pelo Supabase e incluímos o user_id
    const { data, error } = await supabase
      .from("auditorias")
      .insert({
        titulo: auditoria.titulo,
        descricao: auditoria.descricao,
        data: auditoria.data,
        auditor: auditoria.auditor,
        areas: auditoria.areas,
        criterios: auditoria.criterios as unknown as Json,
        user_id: user.id // Vinculamos a auditoria ao usuário atual
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
      criterios: data.criterios as unknown as Auditoria["criterios"],
      user_id: data.user_id
    } : null;
  },

  async getAll(): Promise<Auditoria[]> {
    // Com as políticas RLS configuradas, o Supabase já filtrará automaticamente
    // para retornar apenas as auditorias do usuário autenticado
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
      criterios: item.criterios as unknown as Auditoria["criterios"],
      user_id: item.user_id
    })) : [];
  },

  async getById(id: string): Promise<Auditoria | null> {
    // Com as políticas RLS, o Supabase só retornará a auditoria
    // se ela pertencer ao usuário autenticado
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
      criterios: data.criterios as unknown as Auditoria["criterios"],
      user_id: data.user_id
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
    
    // Com as políticas RLS, o Supabase só atualizará se a auditoria
    // pertencer ao usuário autenticado
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
      criterios: data.criterios as unknown as Auditoria["criterios"],
      user_id: data.user_id
    } : null;
  },

  async delete(id: string): Promise<void> {
    // Com as políticas RLS, o Supabase só excluirá se a auditoria
    // pertencer ao usuário autenticado
    const { error } = await supabase
      .from("auditorias")
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }
};
