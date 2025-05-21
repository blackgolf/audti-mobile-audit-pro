
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditoriaService } from "@/services/auditoriaService";
import { Auditoria, AuditoriaInput, AuditoriaUpdate } from "@/types/auditorias";
import { toast } from "sonner";

export type AuditoriaFilters = {
  areas?: string[];
  unidade?: string;
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
  ordenacao?: {
    campo: 'data' | 'titulo';
    ordem: 'asc' | 'desc';
  };
  pagina: number;
  itensPorPagina: number;
}

export const useAuditorias = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all auditorias with optional filters
  const getAuditorias = (filters?: AuditoriaFilters) => {
    return useQuery({
      queryKey: ["auditorias", filters],
      queryFn: () => auditoriaService.getAll(filters),
    });
  };

  // Fetch a single auditoria by id
  const getAuditoria = (id: string) => {
    return useQuery({
      queryKey: ["auditoria", id],
      queryFn: () => auditoriaService.getById(id),
      enabled: !!id,
    });
  };

  // Create new auditoria
  const createAuditoria = useMutation({
    mutationFn: (auditoria: AuditoriaInput) => {
      setIsLoading(true);
      return auditoriaService.create(auditoria);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auditorias"] });
      toast.success("Auditoria criada com sucesso!");
      setIsLoading(false);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar auditoria: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Update auditoria
  const updateAuditoria = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AuditoriaUpdate }) => {
      setIsLoading(true);
      return auditoriaService.update(id, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["auditorias"] });
      queryClient.invalidateQueries({ queryKey: ["auditoria", variables.id] });
      toast.success("Auditoria atualizada com sucesso!");
      setIsLoading(false);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar auditoria: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Delete auditoria
  const deleteAuditoria = useMutation({
    mutationFn: (id: string) => {
      setIsLoading(true);
      return auditoriaService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auditorias"] });
      toast.success("Auditoria removida com sucesso!");
      setIsLoading(false);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover auditoria: ${error.message}`);
      setIsLoading(false);
    },
  });

  return {
    getAuditorias,
    getAuditoria,
    createAuditoria,
    updateAuditoria,
    deleteAuditoria,
    isLoading,
  };
};
