
import { supabase } from "@/integrations/supabase/client";
import { Auditoria, AuditoriaInput, AuditoriaUpdate } from "@/types/auditorias";
import { Json } from "@/integrations/supabase/types";
import { AuditoriaFilters } from "@/hooks/useAuditorias";

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

  async getAll(filters?: AuditoriaFilters): Promise<{auditorias: Auditoria[], count: number}> {
    // Iniciamos a consulta
    let query = supabase
      .from("auditorias")
      .select('*', { count: 'exact' });
    
    // Aplicamos os filtros se existirem
    if (filters) {
      // Filtro por áreas
      if (filters.areas && filters.areas.length > 0) {
        query = query.contains('areas', filters.areas);
      }
      
      // Filtro por unidade (assumindo que unidade é armazenada em algum campo como "unidade" ou está em "descricao")
      if (filters.unidade) {
        query = query.ilike('descricao', `%${filters.unidade}%`);
      }
      
      // Filtro por período
      if (filters.dataInicio) {
        query = query.gte('data', filters.dataInicio);
      }
      
      if (filters.dataFim) {
        query = query.lte('data', filters.dataFim);
      }
      
      // Busca textual
      if (filters.busca) {
        const searchTerm = `%${filters.busca}%`;
        query = query.or(`titulo.ilike.${searchTerm},descricao.ilike.${searchTerm},auditor.ilike.${searchTerm}`);
      }
      
      // Ordenação
      if (filters.ordenacao) {
        query = query.order(filters.ordenacao.campo, { ascending: filters.ordenacao.ordem === 'asc' });
      } else {
        // Ordenação padrão por data mais recente
        query = query.order('data', { ascending: false });
      }
      
      // Paginação
      const startIndex = (filters.pagina - 1) * filters.itensPorPagina;
      query = query.range(startIndex, startIndex + filters.itensPorPagina - 1);
    } else {
      // Se não houver filtros, aplicamos apenas a ordenação padrão
      query = query.order('data', { ascending: false });
    }
    
    // Executamos a consulta
    const { data, error, count } = await query;
    
    if (error) throw new Error(error.message);
    
    // Convertemos cada item do resultado para o formato do frontend
    const auditorias = data ? data.map(item => ({
      id: item.id,
      titulo: item.titulo,
      descricao: item.descricao,
      data: item.data,
      auditor: item.auditor,
      areas: item.areas,
      criterios: item.criterios as unknown as Auditoria["criterios"],
      user_id: item.user_id
    })) : [];
    
    return { 
      auditorias, 
      count: count || 0 
    };
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
  },
  
  // Obter todas as áreas únicas cadastradas nas auditorias
  async getAreas(): Promise<string[]> {
    const { data, error } = await supabase
      .from("auditorias")
      .select('areas');
      
    if (error) throw new Error(error.message);
    
    // Extrair todas as áreas únicas
    const allAreas = new Set<string>();
    data?.forEach(item => {
      item.areas.forEach((area: string) => {
        allAreas.add(area);
      });
    });
    
    return Array.from(allAreas).sort();
  },
  
  // Obter todas as unidades únicas cadastradas nas descrições das auditorias
  async getUnidades(): Promise<string[]> {
    // Esta é uma implementação simplificada. Na prática, você provavelmente teria
    // um campo específico para unidades ou uma tabela separada.
    // Aqui, estou assumindo que a unidade é mencionada na descrição
    const { data, error } = await supabase
      .from("auditorias")
      .select('descricao');
      
    if (error) throw new Error(error.message);
    
    // Extrai todas as menções de unidades (isso é apenas um exemplo simplificado)
    // Em um sistema real, você precisaria de uma lógica mais robusta ou estrutura de dados adequada
    const unidadesPattern = /(Unidade|Filial|Sede):\s*([^,;\n]+)/g;
    const unidades = new Set<string>();
    
    data?.forEach(item => {
      if (!item.descricao) return;
      
      let match;
      while ((match = unidadesPattern.exec(item.descricao)) !== null) {
        unidades.add(match[2].trim());
      }
    });
    
    // Adiciona algumas unidades fixas para o exemplo
    ["Brasília", "São Paulo", "Rio de Janeiro", "Belo Horizonte"].forEach(u => unidades.add(u));
    
    return Array.from(unidades).sort();
  }
};
