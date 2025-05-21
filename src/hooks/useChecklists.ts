
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checklistService, ChecklistItem } from "@/services/checklistService";
import { Criterio } from "@/types/auditorias";

export const useChecklists = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Buscar todos os critérios
  const { data: checklists = [], refetch: refetchChecklists } = useQuery({
    queryKey: ["checklists"],
    queryFn: checklistService.getAll,
  });

  // Buscar critérios por áreas
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
      justificativa: '' // Valor padrão
    }));
  };

  return {
    checklists,
    getChecklistsByAreas,
    convertToFormCriterios,
    isLoading,
    refetchChecklists,
  };
};
