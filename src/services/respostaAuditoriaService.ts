
import { supabase } from "@/integrations/supabase/client";

export interface RespostaAuditoria {
  id?: string;
  auditoria_id: string;
  checklist_id: string;
  resposta: string;
  nota?: number;
  justificativa?: string;
  respondido_por?: string;
  respondido_por_email?: string;
}

export const respostaAuditoriaService = {
  // Create a new response
  async create(resposta: RespostaAuditoria): Promise<RespostaAuditoria | null> {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("respostas_auditoria")
      .insert({
        ...resposta,
        respondido_por: userData?.user?.id,
        respondido_por_email: userData?.user?.email
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Get all responses for an audit
  async getByAuditoriaId(auditoriaId: string): Promise<RespostaAuditoria[]> {
    const { data, error } = await supabase
      .from("respostas_auditoria")
      .select("*")
      .eq("auditoria_id", auditoriaId);
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Get a specific response 
  async getById(id: string): Promise<RespostaAuditoria | null> {
    const { data, error } = await supabase
      .from("respostas_auditoria")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Update an existing response
  async update(id: string, updates: Partial<RespostaAuditoria>): Promise<RespostaAuditoria | null> {
    const { data, error } = await supabase
      .from("respostas_auditoria")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Delete a response
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("respostas_auditoria")
      .delete()
      .eq("id", id);
    
    if (error) throw new Error(error.message);
  },

  // Bulk create responses
  async createMany(respostas: RespostaAuditoria[]): Promise<RespostaAuditoria[]> {
    const { data: userData } = await supabase.auth.getUser();

    // Add user info to each response
    const responsasWithUser = respostas.map(resposta => ({
      ...resposta,
      respondido_por: userData?.user?.id,
      respondido_por_email: userData?.user?.email
    }));
    
    const { data, error } = await supabase
      .from("respostas_auditoria")
      .insert(responsasWithUser)
      .select();
    
    if (error) throw new Error(error.message);
    return data || [];
  }
};
