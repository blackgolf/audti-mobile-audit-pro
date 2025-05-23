
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checklistService, ChecklistItem } from "@/services/checklistService";
import { Criterio } from "@/types/auditorias";
import { toast } from "sonner";

export const useChecklists = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);

  // Buscar todos os checklists
  const { data: checklists = [], refetch: refetchChecklists, error: checklistsError } = useQuery({
    queryKey: ["checklists"],
    queryFn: checklistService.getAll
  });
  
  // Buscar áreas únicas
  const { data: areas = [], error: areasError } = useQuery({
    queryKey: ["checklist-areas"],
    queryFn: checklistService.getAreas
  });

  // Handle errors for checklists
  if (checklistsError) {
    console.error("Erro ao buscar checklists:", checklistsError);
    toast.error(checklistsError?.message || "Erro ao carregar os checklists");
  }

  // Handle errors for areas
  if (areasError) {
    console.error("Erro ao buscar áreas:", areasError);
    toast.error(areasError?.message || "Erro ao carregar as áreas de checklist");
  }

  // Buscar um checklist específico
  const getChecklistById = (id: string) => {
    return useQuery({
      queryKey: ["checklist", id],
      queryFn: () => checklistService.getById(id),
      enabled: !!id
    });
  };

  // Buscar critérios por áreas
  const getChecklistsByAreas = (areas: string[]) => {
    return useQuery({
      queryKey: ["checklists", areas],
      queryFn: () => checklistService.getByAreas(areas),
      enabled: areas.length > 0
    });
  };
  
  // Mutação para criar um novo item
  const createChecklist = useMutation({
    mutationFn: (newItem: Omit<ChecklistItem, 'id'>) => 
      checklistService.create(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-areas"] });
      toast.success("Item de checklist criado com sucesso");
    },
    onError: (error: any) => {
      console.error("Erro ao criar item de checklist:", error);
      toast.error(error?.message || "Erro ao criar item de checklist");
    }
  });
  
  // Mutação para criar vários itens de uma vez
  const createManyChecklists = useMutation({
    mutationFn: (newItems: Omit<ChecklistItem, 'id'>[]) => 
      checklistService.createMany(newItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-areas"] });
      toast.success("Itens de checklist importados com sucesso");
    },
    onError: (error: any) => {
      console.error("Erro ao importar itens de checklist:", error);
      toast.error(error?.message || "Erro ao importar itens de checklist");
    }
  });
  
  // Mutação para atualizar item existente
  const updateChecklist = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ChecklistItem> }) => 
      checklistService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      toast.success("Item de checklist atualizado com sucesso");
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar item de checklist:", error);
      toast.error(error?.message || "Erro ao atualizar item de checklist");
    }
  });
  
  // Mutação para remover item
  const deleteChecklist = useMutation({
    mutationFn: (id: string) => checklistService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      toast.success("Item de checklist removido com sucesso");
    },
    onError: (error: any) => {
      console.error("Erro ao remover item de checklist:", error);
      toast.error(error?.message || "Erro ao remover item de checklist");
    }
  });
  
  // Mutação para remover área inteira
  const deleteChecklistArea = useMutation({
    mutationFn: (area: string) => checklistService.deleteArea(area),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-areas"] });
      toast.success("Área de checklist removida com sucesso");
    },
    onError: (error: any) => {
      console.error("Erro ao remover área de checklist:", error);
      toast.error(error?.message || "Erro ao remover área de checklist");
    }
  });

  // Converter ChecklistItem para Criterio
  const convertToFormCriterios = (items: ChecklistItem[]): Criterio[] => {
    return items.map(item => ({
      descricao: item.descricao,
      nota: 0, // Valor padrão
      justificativa: '', // Valor padrão
      checklist_id: item.id // Manter o ID do checklist para referência
    }));
  };

  // Função para selecionar um checklist específico
  const selectChecklist = (id: string | null) => {
    setSelectedChecklistId(id);
  };

  // Obter todos os nomes de checklists para seleção
  const getChecklistNames = () => {
    if (!checklists || checklists.length === 0) return [];
    
    // Agrupar checklists por área
    const checklistsByArea = checklists.reduce((acc, item) => {
      if (!acc[item.area]) {
        acc[item.area] = [];
      }
      acc[item.area].push(item);
      return acc;
    }, {} as Record<string, ChecklistItem[]>);
    
    // Converter para o formato de opções de seleção
    return Object.keys(checklistsByArea).map(area => ({
      area,
      id: area, // Usar a área como ID do grupo
      name: area
    }));
  };

  return {
    checklists,
    areas,
    getChecklistById,
    getChecklistsByAreas,
    convertToFormCriterios,
    isLoading,
    refetchChecklists,
    selectedChecklistId,
    selectChecklist,
    getChecklistNames,
    createChecklist,
    createManyChecklists,
    updateChecklist,
    deleteChecklist,
    deleteChecklistArea
  };
};
