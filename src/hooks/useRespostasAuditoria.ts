
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  RespostaAuditoria, 
  respostaAuditoriaService 
} from "@/services/respostaAuditoriaService";
import { toast } from "sonner";

export const useRespostasAuditoria = (auditoriaId?: string) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all responses for an audit
  const getRespostas = () => {
    return useQuery({
      queryKey: ["respostas", auditoriaId],
      queryFn: () => respostaAuditoriaService.getByAuditoriaId(auditoriaId || ""),
      enabled: !!auditoriaId,
    });
  };

  // Create a new response
  const createResposta = useMutation({
    mutationFn: (resposta: RespostaAuditoria) => {
      setIsLoading(true);
      return respostaAuditoriaService.create(resposta);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["respostas", auditoriaId] });
      setIsLoading(false);
      toast.success("Resposta salva com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar resposta: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Bulk create responses
  const createManyRespostas = useMutation({
    mutationFn: (respostas: RespostaAuditoria[]) => {
      setIsLoading(true);
      return respostaAuditoriaService.createMany(respostas);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["respostas", auditoriaId] });
      setIsLoading(false);
      toast.success("Respostas salvas com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar respostas: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Update a response
  const updateResposta = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RespostaAuditoria> }) => {
      setIsLoading(true);
      return respostaAuditoriaService.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["respostas", auditoriaId] });
      setIsLoading(false);
      toast.success("Resposta atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar resposta: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Delete a response
  const deleteResposta = useMutation({
    mutationFn: (id: string) => {
      setIsLoading(true);
      return respostaAuditoriaService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["respostas", auditoriaId] });
      setIsLoading(false);
      toast.success("Resposta removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover resposta: ${error.message}`);
      setIsLoading(false);
    },
  });

  return {
    getRespostas,
    createResposta,
    createManyRespostas,
    updateResposta,
    deleteResposta,
    isLoading,
  };
};
