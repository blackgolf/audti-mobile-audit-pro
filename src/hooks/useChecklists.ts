
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checklistService, ChecklistItem } from "@/services/checklistService";
import { Criterio } from "@/types/auditorias";

export const useChecklists = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);

  // Buscar todos os checklists
  const { data: checklists = [], refetch: refetchChecklists } = useQuery({
    queryKey: ["checklists"],
    queryFn: checklistService.getAll,
  });

  // Buscar um checklist específico
  const getChecklistById = (id: string) => {
    return useQuery({
      queryKey: ["checklist", id],
      queryFn: () => checklistService.getById(id),
      enabled: !!id,
    });
  };

  // Buscar critérios por áreas (função legada, mantida para compatibilidade)
  const getChecklistsByAreas = (areas: string[]) => {
    return useQuery({
      queryKey: ["checklists", areas],
      queryFn: () => checklistService.getByAreas(areas),
      enabled: areas.length > 0,
    });
  };

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
    getChecklistById,
    getChecklistsByAreas,
    convertToFormCriterios,
    isLoading,
    refetchChecklists,
    selectedChecklistId,
    selectChecklist,
    getChecklistNames
  };
};
