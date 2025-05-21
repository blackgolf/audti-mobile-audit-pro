
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
  Camera, 
  Save, 
  FileCheck,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuditorias } from '@/hooks/useAuditorias';
import { Auditoria } from '@/types/auditorias';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Lista de unidades para seleção
const unidades = [
  { id: 1, nome: 'Brasal Refrigerantes - Matriz' },
  { id: 2, nome: 'Brasal Combustíveis - Asa Norte' },
  { id: 3, nome: 'Brasal Veículos - Taguatinga' },
  { id: 4, nome: 'Brasal Incorporações - Sede' },
  { id: 5, nome: 'Brasal Refrigerantes - Gama' },
  { id: 6, nome: 'Brasal Combustíveis - Sudoeste' },
];

// Lista de áreas para seleção
const areas = [
  'Infraestrutura',
  'Segurança',
  'Sistemas',
  'Redes',
  'Banco de Dados',
  'Aplicações',
  'Desenvolvimento',
  'Suporte',
];

// Estrutura para o formulário de auditoria
interface FormData {
  titulo: string;
  descricao: string;
  data: string;
  auditor: string;
  areas: string[];
  criterios: {
    descricao: string;
    nota: number;
    justificativa: string;
  }[];
  unidadeNome: string;
}

const AuditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
  const { 
    getAuditoria,
    createAuditoria,
    updateAuditoria,
    isLoading: isLoadingAuditorias 
  } = useAuditorias();

  // Carregar auditoria existente se estiver editando
  const { data: auditoria, isLoading } = getAuditoria(id || '');
  
  // Inicializar formulário
  const form = useForm<FormData>({
    defaultValues: {
      titulo: '',
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      auditor: '',
      areas: [],
      criterios: [{ descricao: '', nota: 0, justificativa: '' }],
      unidadeNome: ''
    }
  });

  // Preencher o formulário quando a auditoria for carregada (para edição)
  useEffect(() => {
    if (auditoria && id) {
      form.reset({
        titulo: auditoria.titulo,
        descricao: auditoria.descricao || '',
        data: auditoria.data,
        auditor: auditoria.auditor,
        areas: auditoria.areas,
        criterios: auditoria.criterios,
        unidadeNome: 'Unidade' // Este campo não é armazenado no banco de dados
      });
      setSelectedAreas(auditoria.areas);
    }
  }, [auditoria, form, id]);

  // Adicionar novo critério
  const addCriterio = () => {
    const currentCriterios = form.getValues('criterios');
    form.setValue('criterios', [
      ...currentCriterios,
      { descricao: '', nota: 0, justificativa: '' }
    ]);
  };

  // Remover critério
  const removeCriterio = (index: number) => {
    const currentCriterios = form.getValues('criterios');
    if (currentCriterios.length > 1) {
      form.setValue('criterios', currentCriterios.filter((_, i) => i !== index));
    }
  };

  // Toggle categoria aberta/fechada
  const toggleCategories = () => {
    setOpenCategories(prev => !prev);
  };

  // Adicionar/remover área
  const toggleArea = (area: string) => {
    setSelectedAreas(prev => {
      if (prev.includes(area)) {
        return prev.filter(a => a !== area);
      } else {
        return [...prev, area];
      }
    });
    
    const currentAreas = form.getValues('areas');
    if (currentAreas.includes(area)) {
      form.setValue('areas', currentAreas.filter(a => a !== area));
    } else {
      form.setValue('areas', [...currentAreas, area]);
    }
  };

  // Salvar rascunho (versão simplificada)
  const saveDraft = async () => {
    const data = form.getValues();
    data.areas = selectedAreas;
    
    try {
      if (id) {
        await updateAuditoria.mutateAsync({ 
          id, 
          updates: {
            titulo: data.titulo,
            descricao: data.descricao,
            data: data.data,
            auditor: data.auditor,
            areas: data.areas,
            criterios: data.criterios
          }
        });
      } else {
        await createAuditoria.mutateAsync({
          titulo: data.titulo,
          descricao: data.descricao,
          data: data.data,
          auditor: data.auditor,
          areas: data.areas,
          criterios: data.criterios
        });
      }
      toast("Rascunho salvo com sucesso");
    } catch (error) {
      toast.error("Erro ao salvar rascunho");
      console.error(error);
    }
  };

  // Enviar formulário
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    data.areas = selectedAreas;
    
    try {
      if (id) {
        await updateAuditoria.mutateAsync({ 
          id, 
          updates: {
            titulo: data.titulo,
            descricao: data.descricao,
            data: data.data,
            auditor: data.auditor,
            areas: data.areas,
            criterios: data.criterios
          }
        });
        toast.success("Auditoria atualizada com sucesso");
      } else {
        const result = await createAuditoria.mutateAsync({
          titulo: data.titulo,
          descricao: data.descricao,
          data: data.data,
          auditor: data.auditor,
          areas: data.areas,
          criterios: data.criterios
        });
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
    
    const totalFields = requiredFields.length + criterios.length;
    const filledFields = filledRequiredFields + criteriosFilled;
    
    return Math.round((filledFields / totalFields) * 100);
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
                
                <FormField
                  control={form.control}
                  name="areas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Áreas</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {areas.map(area => (
                            <div 
                              key={area}
                              className={`p-2 border rounded-md cursor-pointer ${
                                selectedAreas.includes(area) 
                                  ? 'bg-audti-primary/20 border-audti-primary' 
                                  : 'border-gray-200'
                              }`}
                              onClick={() => toggleArea(area)}
                            >
                              <div className="flex items-center">
                                <div className={`w-4 h-4 mr-2 rounded border ${
                                  selectedAreas.includes(area) 
                                    ? 'bg-audti-primary border-audti-primary' 
                                    : 'border-gray-300'
                                }`}>
                                  {selectedAreas.includes(area) && (
                                    <div className="flex items-center justify-center h-full text-white">
                                      ✓
                                    </div>
                                  )}
                                </div>
                                <span>{area}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
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
                    {form.watch('criterios').map((criterio, index) => (
                      <div key={index} className="p-4 border rounded-md space-y-4">
                        <div className="flex justify-between">
                          <h4 className="text-md font-medium">Critério {index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeCriterio(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={form.watch('criterios').length <= 1}
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
                            }}
                            placeholder="Descreva o critério de avaliação"
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
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Critério
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
