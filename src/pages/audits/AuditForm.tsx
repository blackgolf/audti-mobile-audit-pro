
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Save, 
  FileCheck,
  Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuditorias } from '@/hooks/useAuditorias';
import { useChecklists } from '@/hooks/useChecklists';
import { Auditoria, Criterio } from '@/types/auditorias';
import { ChecklistItem } from '@/services/checklistService';
import { useRespostasAuditoria } from '@/hooks/useRespostasAuditoria';
import { RespostaAuditoria } from '@/services/respostaAuditoriaService';

// Lista de unidades para seleção
const unidades = [
  { id: 1, nome: 'Brasal Refrigerantes - Matriz' },
  { id: 2, nome: 'Brasal Combustíveis - Asa Norte' },
  { id: 3, nome: 'Brasal Veículos - Taguatinga' },
  { id: 4, nome: 'Brasal Incorporações - Sede' },
  { id: 5, nome: 'Brasal Refrigerantes - Gama' },
  { id: 6, nome: 'Brasal Combustíveis - Sudoeste' },
];

// Estrutura para o formulário de auditoria
interface FormData {
  titulo: string;
  descricao: string;
  data: string;
  auditor: string;
  checklist: string; // Novo campo para seleção de checklist
  criterios: {
    descricao: string;
    nota: number;
    justificativa: string;
    checklist_id?: string; // ID opcional do checklist associado
  }[];
  unidadeNome: string;
}

const AuditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);
  const [loadedCriterios, setLoadedCriterios] = useState<Criterio[]>([]);
  const [customCriterios, setCustomCriterios] = useState<Criterio[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [respostas, setRespostas] = useState<Record<string, RespostaAuditoria>>({});
  
  const { 
    getAuditoria,
    createAuditoria,
    updateAuditoria,
    isLoading: isLoadingAuditorias 
  } = useAuditorias();
  
  const { 
    checklists,
    getChecklistNames,
    convertToFormCriterios,
    isLoading: isLoadingChecklists
  } = useChecklists();

  const { 
    getRespostas, 
    createManyRespostas, 
    isLoading: isLoadingRespostas 
  } = useRespostasAuditoria(id);

  // Buscar respostas existentes para a auditoria (em caso de edição)
  const { data: respostasData = [], isLoading: isLoadingRespostasData } = getRespostas();

  // Carregar auditoria existente se estiver editando
  const { data: auditoria, isLoading } = getAuditoria(id || '');
  
  // Inicializar formulário
  const form = useForm<FormData>({
    defaultValues: {
      titulo: '',
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      auditor: '',
      checklist: '',
      criterios: [],
      unidadeNome: ''
    }
  });

  // Processar respostas quando carregadas
  useEffect(() => {
    if (respostasData && respostasData.length > 0) {
      const respostasMap: Record<string, RespostaAuditoria> = {};
      
      respostasData.forEach(resposta => {
        respostasMap[resposta.checklist_id] = resposta;
      });
      
      setRespostas(respostasMap);
    }
  }, [respostasData]);

  // Preencher o formulário quando a auditoria for carregada (para edição)
  useEffect(() => {
    if (auditoria && id) {
      form.reset({
        titulo: auditoria.titulo,
        descricao: auditoria.descricao || '',
        data: auditoria.data,
        auditor: auditoria.auditor,
        checklist: auditoria.checklist_id || '', // Novo campo
        criterios: auditoria.criterios,
        unidadeNome: auditoria.unidade || '' // Este campo pode não estar no banco ainda
      });
      
      // Se a auditoria tiver um checklist_id, selecione-o
      if (auditoria.checklist_id) {
        setSelectedChecklistId(auditoria.checklist_id);
      }
      
      // Separar critérios carregados do checklist e critérios customizados
      if (auditoria.criterios && auditoria.criterios.length > 0) {
        const checklistCriterios = auditoria.criterios.filter(c => c.checklist_id);
        const customCrits = auditoria.criterios.filter(c => !c.checklist_id);
        
        setLoadedCriterios(checklistCriterios);
        setCustomCriterios(customCrits);
      }
    }
  }, [auditoria, form, id]);

  // Efeito para carregar checklist quando o ID do checklist mudar
  useEffect(() => {
    if (selectedChecklistId) {
      // Filtrar checklists pelo ID selecionado
      const selectedItems = checklists.filter(item => item.area === selectedChecklistId);
      if (selectedItems.length > 0) {
        setChecklist(selectedItems);
        
        // Converter items do checklist para critérios e adicionar ao formulário
        const newCriterios = convertToFormCriterios(selectedItems);
        setLoadedCriterios(newCriterios);
        
        // Combinar com critérios customizados, se existirem
        const allCriterios = [...newCriterios, ...customCriterios];
        form.setValue('criterios', allCriterios);
      }
    } else {
      setChecklist([]);
      // Manter apenas critérios customizados se não houver checklist selecionado
      form.setValue('criterios', customCriterios);
      setLoadedCriterios([]);
    }
  }, [selectedChecklistId, checklists, form]);

  // Handler para mudança de checklist
  const handleChecklistChange = (checklistId: string) => {
    setSelectedChecklistId(checklistId);
    form.setValue('checklist', checklistId);
  };

  // Adicionar novo critério customizado
  const addCriterio = () => {
    const newCriterio = { descricao: '', nota: 0, justificativa: '' };
    setCustomCriterios([...customCriterios, newCriterio]);
    
    const currentCriterios = form.getValues('criterios');
    form.setValue('criterios', [...currentCriterios, newCriterio]);
  };

  // Remover critério
  const removeCriterio = (index: number) => {
    const currentCriterios = form.getValues('criterios');
    const criterioToRemove = currentCriterios[index];
    
    // Verificar se é um critério carregado do checklist ou customizado
    if (criterioToRemove.checklist_id) {
      // Não podemos remover critérios carregados do checklist
      toast.error("Não é possível remover critérios carregados automaticamente. Selecione outro checklist para substituí-los.");
      return;
    }
    
    const newCustomCriterios = customCriterios.filter((_, i) => i !== customCriterios.indexOf(criterioToRemove));
    setCustomCriterios(newCustomCriterios);
    
    form.setValue('criterios', currentCriterios.filter((_, i) => i !== index));
  };

  // Toggle categoria aberta/fechada
  const toggleCategories = () => {
    setOpenCategories(prev => !prev);
  };

  // Salvar respostas de checklist
  const saveChecklistResponses = async (auditoriaId: string, criterios: FormData['criterios']) => {
    // Filtrar apenas critérios que têm checklist_id (são do checklist)
    const checklistCriterios = criterios.filter(c => c.checklist_id);
    
    if (checklistCriterios.length === 0) return;
    
    // Converter critérios para o formato de respostas
    const responsasToSave: RespostaAuditoria[] = checklistCriterios.map(criterio => ({
      auditoria_id: auditoriaId,
      checklist_id: criterio.checklist_id as string,
      resposta: criterio.nota.toString(),
      nota: criterio.nota,
      justificativa: criterio.justificativa
    }));
    
    // Salvar todas as respostas de uma vez
    await createManyRespostas.mutateAsync(responsasToSave);
  };

  // Salvar rascunho (versão simplificada)
  const saveDraft = async () => {
    const data = form.getValues();
    
    try {
      if (id) {
        const updatedAuditoria = await updateAuditoria.mutateAsync({ 
          id, 
          updates: {
            titulo: data.titulo,
            descricao: data.descricao,
            data: data.data,
            auditor: data.auditor,
            areas: [], // Add empty areas array
            checklist_id: selectedChecklistId || undefined,
            criterios: data.criterios,
            unidade: data.unidadeNome
          }
        });
        
        // Salvar respostas do checklist
        if (updatedAuditoria) {
          await saveChecklistResponses(updatedAuditoria.id as string, data.criterios);
        }
        
        toast.success("Rascunho salvo com sucesso");
      } else {
        const newAuditoria = await createAuditoria.mutateAsync({
          titulo: data.titulo,
          descricao: data.descricao,
          data: data.data,
          auditor: data.auditor,
          areas: [], // Add empty areas array
          checklist_id: selectedChecklistId || undefined,
          criterios: data.criterios,
          unidade: data.unidadeNome
        });
        
        // Salvar respostas do checklist
        if (newAuditoria) {
          await saveChecklistResponses(newAuditoria.id as string, data.criterios);
        }
        
        toast.success("Rascunho salvo com sucesso");
      }
    } catch (error) {
      toast.error("Erro ao salvar rascunho");
      console.error(error);
    }
  };

  // Enviar formulário
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      if (id) {
        const updatedAuditoria = await updateAuditoria.mutateAsync({ 
          id, 
          updates: {
            titulo: data.titulo,
            descricao: data.descricao,
            data: data.data,
            auditor: data.auditor,
            areas: [], // Add empty areas array
            checklist_id: selectedChecklistId || undefined,
            criterios: data.criterios,
            unidade: data.unidadeNome
          }
        });
        
        // Salvar respostas do checklist
        if (updatedAuditoria) {
          await saveChecklistResponses(updatedAuditoria.id as string, data.criterios);
        }
        
        toast.success("Auditoria atualizada com sucesso");
      } else {
        const newAuditoria = await createAuditoria.mutateAsync({
          titulo: data.titulo,
          descricao: data.descricao,
          data: data.data,
          auditor: data.auditor,
          areas: [], // Add empty areas array
          checklist_id: selectedChecklistId || undefined,
          criterios: data.criterios,
          unidade: data.unidadeNome
        });
        
        // Salvar respostas do checklist
        if (newAuditoria) {
          await saveChecklistResponses(newAuditoria.id as string, data.criterios);
        }
        
        toast.success("Auditoria criada com sucesso");
      }
      navigate('/audits');
    } catch (error) {
      toast.error("Erro ao salvar auditoria");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular progresso do formulário
  const calculateProgress = () => {
    const { titulo, data, auditor, criterios } = form.getValues();
    const requiredFields = [titulo, data, auditor];
    const filledRequiredFields = requiredFields.filter(Boolean).length;
    const criteriosFilled = criterios.filter(c => c.descricao && c.nota > 0).length;
    
    const totalFields = requiredFields.length + (criterios.length || 1);
    const filledFields = filledRequiredFields + criteriosFilled;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  // Verifica se um critério é carregado automaticamente ou customizado
  const isCriterioFromChecklist = (criterio: Criterio) => {
    return !!criterio.checklist_id;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Carregando auditoria...</p>
        </div>
      </AppLayout>
    );
  }

  // Obter lista de checklists disponíveis
  const checklistOptions = getChecklistNames();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? 'Editar Auditoria' : 'Nova Auditoria'}
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={saveDraft} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" /> Salvar Rascunho
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              <FileCheck className="h-4 w-4 mr-2" /> 
              {isSubmitting ? 'Salvando...' : 'Finalizar Auditoria'}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Auditoria*</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o título da auditoria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data*</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="auditor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auditor*</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do auditor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="unidadeNome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma unidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unidades.map((unidade) => (
                              <SelectItem key={unidade.id} value={unidade.nome}>
                                {unidade.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o objetivo da auditoria" 
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Novo seletor de Checklist (substituindo a seleção de áreas) */}
                <FormField
                  control={form.control}
                  name="checklist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Checklist</FormLabel>
                      <Select
                        onValueChange={(value) => handleChecklistChange(value)}
                        value={selectedChecklistId || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um checklist" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="no-checklist" value="no-checklist">Nenhum (só critérios customizados)</SelectItem>
                          {checklistOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {isLoadingChecklists && <p className="text-sm text-muted-foreground mt-2">Carregando checklists...</p>}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <Collapsible open={openCategories} onOpenChange={toggleCategories}>
                <CardHeader className="pb-2">
                  <CollapsibleTrigger className="flex justify-between items-center w-full cursor-pointer">
                    <CardTitle>Critérios de Avaliação</CardTitle>
                    {openCategories ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {(isLoadingChecklists || isLoadingRespostasData) && (
                      <div className="flex justify-center py-4">
                        <p>Carregando critérios...</p>
                      </div>
                    )}
                    
                    {form.watch('criterios').map((criterio, index) => (
                      <div 
                        key={index} 
                        className={`p-4 border rounded-md space-y-4 ${
                          isCriterioFromChecklist(criterio)
                            ? 'border-audti-primary/30 bg-audti-primary/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between">
                          <h4 className="text-md font-medium">Critério {index + 1} {isCriterioFromChecklist(criterio) ? '(Automático)' : '(Customizado)'}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeCriterio(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={isCriterioFromChecklist(criterio)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div>
                          <FormLabel>Descrição</FormLabel>
                          <Input 
                            value={criterio.descricao}
                            onChange={(e) => {
                              const newCriterios = [...form.getValues('criterios')];
                              newCriterios[index].descricao = e.target.value;
                              form.setValue('criterios', newCriterios);
                              
                              // Se for critério customizado, atualizar o estado
                              if (!isCriterioFromChecklist(criterio)) {
                                const newCustomCriterios = [...customCriterios];
                                const customIndex = customCriterios.findIndex(c => 
                                  c === criterio || c.descricao === criterio.descricao
                                );
                                if (customIndex !== -1) {
                                  newCustomCriterios[customIndex].descricao = e.target.value;
                                  setCustomCriterios(newCustomCriterios);
                                }
                              }
                            }}
                            placeholder="Descreva o critério de avaliação"
                            readOnly={isCriterioFromChecklist(criterio)}
                            className={isCriterioFromChecklist(criterio) ? "bg-gray-50" : ""}
                          />
                        </div>
                        
                        <div>
                          <FormLabel>Nota (1-5)</FormLabel>
                          <div className="flex space-x-2 mt-2">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <Button
                                key={score}
                                type="button"
                                size="sm"
                                variant={criterio.nota === score ? "default" : "outline"}
                                onClick={() => {
                                  const newCriterios = [...form.getValues('criterios')];
                                  newCriterios[index].nota = score;
                                  form.setValue('criterios', newCriterios);
                                  
                                  // Atualizar também no estado apropriado (loadedCriterios ou customCriterios)
                                  if (isCriterioFromChecklist(criterio)) {
                                    const newLoadedCriterios = [...loadedCriterios];
                                    const loadedIndex = newLoadedCriterios.findIndex(c => 
                                      c === criterio || (c.checklist_id && c.checklist_id === criterio.checklist_id)
                                    );
                                    if (loadedIndex !== -1) {
                                      newLoadedCriterios[loadedIndex].nota = score;
                                      setLoadedCriterios(newLoadedCriterios);
                                    }
                                  } else {
                                    const newCustomCriterios = [...customCriterios];
                                    const customIndex = customCriterios.findIndex(c => 
                                      c === criterio || c.descricao === criterio.descricao
                                    );
                                    if (customIndex !== -1) {
                                      newCustomCriterios[customIndex].nota = score;
                                      setCustomCriterios(newCustomCriterios);
                                    }
                                  }
                                }}
                                className={`w-10 ${
                                  criterio.nota === score ? 'bg-audti-primary' : ''
                                }`}
                              >
                                {score}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <FormLabel>Justificativa</FormLabel>
                          <Textarea 
                            value={criterio.justificativa}
                            onChange={(e) => {
                              const newCriterios = [...form.getValues('criterios')];
                              newCriterios[index].justificativa = e.target.value;
                              form.setValue('criterios', newCriterios);
                              
                              // Atualizar também no estado apropriado
                              if (isCriterioFromChecklist(criterio)) {
                                const newLoadedCriterios = [...loadedCriterios];
                                const loadedIndex = newLoadedCriterios.findIndex(c => 
                                  c === criterio || (c.checklist_id && c.checklist_id === criterio.checklist_id)
                                );
                                if (loadedIndex !== -1) {
                                  newLoadedCriterios[loadedIndex].justificativa = e.target.value;
                                  setLoadedCriterios(newLoadedCriterios);
                                }
                              } else {
                                const newCustomCriterios = [...customCriterios];
                                const customIndex = customCriterios.findIndex(c => 
                                  c === criterio || c.descricao === criterio.descricao
                                );
                                if (customIndex !== -1) {
                                  newCustomCriterios[customIndex].justificativa = e.target.value;
                                  setCustomCriterios(newCustomCriterios);
                                }
                              }
                            }}
                            placeholder="Justifique a nota atribuída"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCriterio}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Critério Customizado
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            <div className="h-20"></div>
          </form>
        </Form>

        {/* Fixed bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Progresso: {calculateProgress()}%</span>
              <div className="ml-2 h-2 w-32 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-audti-secondary rounded-full" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/audits')}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={saveDraft} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" /> Salvar Rascunho
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              <FileCheck className="h-4 w-4 mr-2" /> 
              {isSubmitting ? 'Salvando...' : 'Finalizar'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AuditForm;
