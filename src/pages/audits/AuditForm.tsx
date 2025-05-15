import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Camera, 
  Save, 
  FileCheck 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mock data for checklist items
const mockCategories = [
  {
    id: 1,
    name: 'Infraestrutura',
    items: [
      { id: 101, question: 'Os switches estão devidamente instalados e documentados?', weight: 5 },
      { id: 102, question: 'O cabeamento de rede está organizado e identificado?', weight: 4 },
      { id: 103, question: 'O rack está limpo e bem organizado?', weight: 3 },
      { id: 104, question: 'O sistema de refrigeração está funcionando adequadamente?', weight: 5 },
    ]
  },
  {
    id: 2,
    name: 'Segurança',
    items: [
      { id: 201, question: 'Os servidores possuem antivírus atualizado?', weight: 5 },
      { id: 202, question: 'O firewall está configurado corretamente?', weight: 5 },
      { id: 203, question: 'As políticas de backup estão sendo seguidas?', weight: 4 },
      { id: 204, question: 'O controle de acesso à sala de servidores é adequado?', weight: 3 },
    ]
  },
  {
    id: 3,
    name: 'Sistemas',
    items: [
      { id: 301, question: 'Os sistemas operacionais estão atualizados?', weight: 4 },
      { id: 302, question: 'Os softwares estão licenciados corretamente?', weight: 5 },
      { id: 303, question: 'As estações de trabalho possuem as configurações padrão?', weight: 3 },
      { id: 304, question: 'O ERP está funcionando sem erros recorrentes?', weight: 4 },
    ]
  }
];

// Mock data for units
const mockUnits = [
  { id: 1, name: 'Brasal Refrigerantes - Matriz' },
  { id: 2, name: 'Brasal Combustíveis - Asa Norte' },
  { id: 3, name: 'Brasal Veículos - Taguatinga' },
  { id: 4, name: 'Brasal Incorporações - Sede' },
  { id: 5, name: 'Brasal Refrigerantes - Gama' },
  { id: 6, name: 'Brasal Combustíveis - Sudoeste' },
];

// Type for checklist form answers
interface ChecklistAnswer {
  itemId: number;
  question: string;
  score: number;
  observation: string;
  actionPlan: string;
  photos: string[];
  weight: number;
}

interface AuditFormData {
  unitId: number;
  unitName: string;
  date: string;
  technician: string;
  answers: Record<number, ChecklistAnswer>;
}

const AuditForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});
  const [selectedUnit, setSelectedUnit] = useState<{id: number, name: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<AuditFormData>({
    defaultValues: {
      unitId: 0,
      unitName: '',
      date: new Date().toISOString().split('T')[0],
      technician: 'Carlos Silva', // Normally this would come from auth context
      answers: {}
    }
  });

  // Initialize answers state from checklist items
  useEffect(() => {
    const initialAnswers: Record<number, ChecklistAnswer> = {};
    mockCategories.forEach(category => {
      category.items.forEach(item => {
        initialAnswers[item.id] = {
          itemId: item.id,
          question: item.question,
          score: 0,
          observation: '',
          actionPlan: '',
          photos: [],
          weight: item.weight
        };
      });
    });
    form.setValue('answers', initialAnswers);
    
    // Set all categories open initially
    const categoriesState: Record<number, boolean> = {};
    mockCategories.forEach(cat => {
      categoriesState[cat.id] = true;
    });
    setOpenCategories(categoriesState);
  }, []);

  // Handle unit selection from URL parameter
  useEffect(() => {
    const unitIdParam = searchParams.get('unitId');
    if (unitIdParam) {
      const unitId = parseInt(unitIdParam);
      const unit = mockUnits.find(u => u.id === unitId);
      if (unit) {
        setSelectedUnit(unit);
        form.setValue('unitId', unit.id);
        form.setValue('unitName', unit.name);
      }
    }
  }, [searchParams]);

  // Calculate the progress percentage
  const calculateProgress = () => {
    const answers = form.getValues('answers');
    if (!answers) return 0;
    
    const items = Object.values(answers);
    const answeredItems = items.filter(item => item.score > 0);
    return Math.round((answeredItems.length / items.length) * 100);
  };

  // Calculate the weighted average score
  const calculateScore = () => {
    const answers = form.getValues('answers');
    if (!answers) return 0;

    const items = Object.values(answers);
    const scoredItems = items.filter(item => item.score > 0);
    
    if (scoredItems.length === 0) return 0;
    
    const totalWeightedScore = scoredItems.reduce((acc, item) => 
      acc + (item.score * item.weight), 0);
    const totalWeight = scoredItems.reduce((acc, item) => acc + item.weight, 0);
    
    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(1) : 0;
  };

  // Toggle category open/closed state
  const toggleCategory = (categoryId: number) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Save draft
  const saveDraft = () => {
    toast({
      title: "Rascunho salvo",
      description: "Os dados da auditoria foram salvos como rascunho."
    });
  };

  // Submit form
  const onSubmit = (data: AuditFormData) => {
    setIsSubmitting(true);
    
    // In a real app, we would send this data to an API
    console.log('Audit data:', data);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Auditoria finalizada",
        description: "A auditoria foi concluída e o relatório está disponível."
      });
      
      // Redirect to the report page
      navigate('/reports/new');
    }, 1500);
  };

  // Handle score change for an item
  const setScore = (itemId: number, score: number) => {
    const currentAnswers = form.getValues('answers');
    form.setValue('answers', {
      ...currentAnswers,
      [itemId]: {
        ...currentAnswers[itemId],
        score
      }
    });
    form.trigger('answers');
  };

  // Handle observation change for an item
  const setObservation = (itemId: number, observation: string) => {
    const currentAnswers = form.getValues('answers');
    form.setValue('answers', {
      ...currentAnswers,
      [itemId]: {
        ...currentAnswers[itemId],
        observation
      }
    });
  };

  // Handle action plan change for an item
  const setActionPlan = (itemId: number, actionPlan: string) => {
    const currentAnswers = form.getValues('answers');
    form.setValue('answers', {
      ...currentAnswers,
      [itemId]: {
        ...currentAnswers[itemId],
        actionPlan
      }
    });
  };

  // Mock function to add a photo (in a real app, this would open the camera)
  const addPhoto = (itemId: number) => {
    const currentAnswers = form.getValues('answers');
    // Mock photo URL
    const mockPhotoUrl = `https://picsum.photos/seed/${itemId}-${Date.now()}/300/200`;
    
    form.setValue('answers', {
      ...currentAnswers,
      [itemId]: {
        ...currentAnswers[itemId],
        photos: [...currentAnswers[itemId].photos, mockPhotoUrl]
      }
    });
    
    toast({
      title: "Foto adicionada",
      description: "A foto foi adicionada ao item da auditoria."
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? 'Editar Auditoria' : 'Nova Auditoria'}
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={saveDraft}>
              <Save className="h-4 w-4 mr-2" /> Salvar Rascunho
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || !selectedUnit}>
              <FileCheck className="h-4 w-4 mr-2" /> 
              {isSubmitting ? 'Finalizando...' : 'Finalizar Auditoria'}
            </Button>
          </div>
        </div>

        {!selectedUnit ? (
          <Card>
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Selecione uma Unidade</h3>
                <p className="text-gray-500">
                  Por favor, selecione uma unidade para iniciar a auditoria
                </p>
                <Button asChild className="mt-4">
                  <a href="/units">Selecionar Unidade</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Audit Header */}
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-wrap gap-6 justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Unidade</p>
                    <h3 className="text-lg font-medium">{selectedUnit.name}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Data</p>
                    <h3 className="text-lg font-medium">{new Date().toLocaleDateString('pt-BR')}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Técnico</p>
                    <h3 className="text-lg font-medium">{form.getValues('technician')}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Progresso</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-24 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-audti-secondary rounded-full" 
                          style={{ width: `${calculateProgress()}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{calculateProgress()}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Nota Média</p>
                    <h3 className="text-lg font-medium">{calculateScore()} <span className="text-sm text-gray-500">/ 5</span></h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Checklist */}
            <Form {...form}>
              <form>
                {mockCategories.map((category) => (
                  <Card key={category.id} className="mb-4">
                    <Collapsible 
                      open={openCategories[category.id]} 
                      onOpenChange={() => toggleCategory(category.id)}
                    >
                      <CardHeader className="pb-2">
                        <CollapsibleTrigger className="flex justify-between items-center w-full cursor-pointer">
                          <CardTitle>{category.name}</CardTitle>
                          {openCategories[category.id] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-2">
                          <div className="space-y-6">
                            {category.items.map((item) => {
                              const answers = form.getValues('answers');
                              const answer = answers[item.id];
                              return (
                                <div key={item.id} className="p-4 border rounded-md space-y-4">
                                  <div className="flex justify-between">
                                    <h4 className="text-md font-medium">{item.question}</h4>
                                    <span className="text-xs text-gray-500">Peso: {item.weight}</span>
                                  </div>
                                  
                                  {/* Score Selection */}
                                  <div>
                                    <FormLabel>Nota:</FormLabel>
                                    <div className="flex space-x-2 mt-2">
                                      {[0, 1, 2, 3, 4, 5].map((score) => (
                                        <Button
                                          key={score}
                                          type="button"
                                          size="sm"
                                          variant={answer?.score === score ? "default" : "outline"}
                                          onClick={() => setScore(item.id, score)}
                                          className={`w-10 ${
                                            answer?.score === score ? 'bg-audti-primary' : ''
                                          } ${
                                            score === 0 ? 'text-red-500 border-red-200' : ''
                                          }`}
                                        >
                                          {score}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Observation */}
                                  <div>
                                    <FormLabel>Observação:</FormLabel>
                                    <Textarea 
                                      value={answer?.observation || ''}
                                      onChange={(e) => setObservation(item.id, e.target.value)}
                                      placeholder="Adicione observações sobre este item"
                                      className="mt-2"
                                    />
                                  </div>
                                  
                                  {/* Action Plan */}
                                  <div>
                                    <FormLabel>Plano de ação:</FormLabel>
                                    <Textarea 
                                      value={answer?.actionPlan || ''}
                                      onChange={(e) => setActionPlan(item.id, e.target.value)}
                                      placeholder="Sugira ações para melhorar este item"
                                      className="mt-2"
                                    />
                                  </div>
                                  
                                  {/* Photos */}
                                  <div>
                                    <div className="flex justify-between items-center">
                                      <FormLabel>Fotos:</FormLabel>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => addPhoto(item.id)}
                                      >
                                        <Camera className="h-4 w-4 mr-2" /> 
                                        Adicionar Foto
                                      </Button>
                                    </div>
                                    
                                    {answer?.photos && answer.photos.length > 0 && (
                                      <div className="grid grid-cols-3 gap-2 mt-2">
                                        {answer.photos.map((photo, index) => (
                                          <div 
                                            key={index} 
                                            className="aspect-video bg-gray-100 rounded overflow-hidden"
                                          >
                                            <img 
                                              src={photo} 
                                              alt={`Foto ${index + 1}`} 
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
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
                <div className="font-medium text-gray-700">
                  Nota: {calculateScore()} / 5
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={saveDraft}>
                  <Save className="h-4 w-4 mr-2" /> Salvar Rascunho
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                  <FileCheck className="h-4 w-4 mr-2" /> 
                  {isSubmitting ? 'Finalizando...' : 'Finalizar Auditoria'}
                </Button>
              </div>
            </div>
            <div className="h-20" /> {/* Spacer for the fixed bottom bar */}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default AuditForm;
