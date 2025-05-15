
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Upload, Download, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Define type interfaces
interface ChecklistItem {
  id: number;
  question: string;
  weight: number;
}

interface Category {
  id: number;
  name: string;
  items: ChecklistItem[];
}

// Storage key for localStorage
const STORAGE_KEY = 'audti-checklist-categories';

const ChecklistsManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Modal states
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [newItemCategoryId, setNewItemCategoryId] = useState<number | null>(null);
  const [newItemQuestion, setNewItemQuestion] = useState('');
  const [newItemWeight, setNewItemWeight] = useState<number>(3);
  
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editItemCategoryId, setEditItemCategoryId] = useState<number | null>(null);
  const [editItemQuestion, setEditItemQuestion] = useState('');
  const [editItemWeight, setEditItemWeight] = useState<number>(3);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemCategoryId, setDeleteItemCategoryId] = useState<number | null>(null);

  // File input reference
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedCategories = localStorage.getItem(STORAGE_KEY);
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (error) {
        console.error('Error parsing stored categories:', error);
        // Initialize with mock data if parsing fails
        setCategories(mockCategories);
      }
    } else {
      // Use mock data if nothing is stored
      setCategories(mockCategories);
    }
  }, []);

  // Save data to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  // Filter categories and items based on search term
  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || category.items.length > 0
  );

  // Generate unique ID for new items
  const generateId = (): number => {
    return Math.floor(Math.random() * 10000);
  };

  // Handler for adding new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    
    const newCategory: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      items: []
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsNewCategoryOpen(false);
    
    toast({
      title: "Categoria criada",
      description: `A categoria "${newCategoryName}" foi criada com sucesso.`
    });
  };

  // Handler for editing category
  const handleEditCategory = () => {
    if (!editCategoryName.trim() || editCategoryId === null) {
      toast({
        title: "Nome inválido",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    
    setCategories(categories.map(category => 
      category.id === editCategoryId 
        ? { ...category, name: editCategoryName.trim() }
        : category
    ));
    
    setEditCategoryName('');
    setEditCategoryId(null);
    setIsEditCategoryOpen(false);
    
    toast({
      title: "Categoria atualizada",
      description: "O nome da categoria foi atualizado com sucesso."
    });
  };

  // Handler for adding new item to a category
  const handleAddItem = () => {
    if (!newItemQuestion.trim() || newItemCategoryId === null) {
      toast({
        title: "Dados inválidos",
        description: "A pergunta não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }
    
    const newItem: ChecklistItem = {
      id: generateId(),
      question: newItemQuestion.trim(),
      weight: newItemWeight
    };
    
    setCategories(categories.map(category => 
      category.id === newItemCategoryId 
        ? { ...category, items: [...category.items, newItem] }
        : category
    ));
    
    setNewItemQuestion('');
    setNewItemWeight(3);
    setNewItemCategoryId(null);
    setIsNewItemOpen(false);
    
    toast({
      title: "Item adicionado",
      description: "O item foi adicionado com sucesso à categoria."
    });
  };

  // Handler for editing an item
  const handleEditItem = () => {
    if (!editItemQuestion.trim() || editItemCategoryId === null || editItemId === null) {
      toast({
        title: "Dados inválidos",
        description: "A pergunta não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }
    
    setCategories(categories.map(category => 
      category.id === editItemCategoryId 
        ? { 
            ...category, 
            items: category.items.map(item => 
              item.id === editItemId 
                ? { ...item, question: editItemQuestion.trim(), weight: editItemWeight }
                : item
            )
          }
        : category
    ));
    
    setEditItemQuestion('');
    setEditItemWeight(3);
    setEditItemCategoryId(null);
    setEditItemId(null);
    setIsEditItemOpen(false);
    
    toast({
      title: "Item atualizado",
      description: "O item foi atualizado com sucesso."
    });
  };

  // Handler for deleting an item
  const handleDeleteItem = () => {
    if (deleteItemCategoryId === null || deleteItemId === null) {
      return;
    }
    
    setCategories(categories.map(category => 
      category.id === deleteItemCategoryId 
        ? { 
            ...category, 
            items: category.items.filter(item => item.id !== deleteItemId)
          }
        : category
    ));
    
    setDeleteItemCategoryId(null);
    setDeleteItemId(null);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Item excluído",
      description: "O item foi excluído com sucesso."
    });
  };

  // Handler for importing data from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (Array.isArray(importedData)) {
          const newCategories: Category[] = importedData.map(item => ({
            id: generateId(),
            name: item.categoria || "Categoria Importada",
            items: Array.isArray(item.itens) 
              ? item.itens.map((subitem: any) => ({
                  id: generateId(),
                  question: subitem.pergunta || "Item importado",
                  weight: Number(subitem.peso) || 3
                }))
              : []
          }));
          
          setCategories([...categories, ...newCategories]);
          
          toast({
            title: "Importação concluída",
            description: `${newCategories.length} categorias foram importadas com sucesso.`
          });
        } else {
          throw new Error("Formato de JSON inválido");
        }
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "O arquivo não contém dados JSON válidos no formato esperado.",
          variant: "destructive"
        });
        console.error("Import error:", error);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  // Handler for exporting data to JSON file
  const handleExport = () => {
    if (categories.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Adicione categorias e itens antes de exportar.",
        variant: "destructive"
      });
      return;
    }
    
    const exportData = categories.map(category => ({
      categoria: category.name,
      itens: category.items.map(item => ({
        pergunta: item.question,
        peso: item.weight
      }))
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'checklists_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso."
    });
  };

  // Mock categories data
  const mockCategories: Category[] = [
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Checklists</h1>
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
              id="file-import"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" /> Importar
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Exportar
            </Button>
            <Button onClick={() => setIsNewCategoryOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Nova Categoria
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Itens de Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar items ou categorias..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma categoria ou item encontrado.</p>
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <Collapsible key={category.id} defaultOpen={true} className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <CollapsibleTrigger className="font-bold text-lg hover:text-audti-primary flex items-center transition-colors">
                        {category.name}
                      </CollapsibleTrigger>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewItemCategoryId(category.id);
                            setIsNewItemOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Item
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditCategoryId(category.id);
                            setEditCategoryName(category.name);
                            setIsEditCategoryOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <CollapsibleContent>
                      {category.items.length === 0 ? (
                        <p className="text-gray-500 py-2">Nenhum item encontrado</p>
                      ) : (
                        <div className="space-y-2">
                          {category.items.map((item) => (
                            <div 
                              key={item.id} 
                              className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50"
                            >
                              <div className="space-y-1">
                                <p>{item.question}</p>
                                <p className="text-sm text-gray-500">Peso: {item.weight}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setEditItemId(item.id);
                                    setEditItemCategoryId(category.id);
                                    setEditItemQuestion(item.question);
                                    setEditItemWeight(item.weight);
                                    setIsEditItemOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setDeleteItemId(item.id);
                                    setDeleteItemCategoryId(category.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal: New Category */}
        <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-category">Nome da Categoria</Label>
                <Input
                  id="new-category"
                  placeholder="Digite o nome da categoria..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewCategoryOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddCategory}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Edit Category */}
        <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Nome da Categoria</Label>
                <Input
                  id="edit-category"
                  placeholder="Digite o nome da categoria..."
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>Cancelar</Button>
              <Button onClick={handleEditCategory}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: New Item */}
        <Dialog open={isNewItemOpen} onOpenChange={setIsNewItemOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-item-question">Pergunta</Label>
                <Textarea
                  id="new-item-question"
                  placeholder="Digite a pergunta..."
                  value={newItemQuestion}
                  onChange={(e) => setNewItemQuestion(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-item-weight">Peso (1-5)</Label>
                <Input
                  id="new-item-weight"
                  type="number"
                  min={1}
                  max={5}
                  value={newItemWeight}
                  onChange={(e) => setNewItemWeight(Number(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewItemOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddItem}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Edit Item */}
        <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-item-question">Pergunta</Label>
                <Textarea
                  id="edit-item-question"
                  placeholder="Digite a pergunta..."
                  value={editItemQuestion}
                  onChange={(e) => setEditItemQuestion(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-weight">Peso (1-5)</Label>
                <Input
                  id="edit-item-weight"
                  type="number"
                  min={1}
                  max={5}
                  value={editItemWeight}
                  onChange={(e) => setNewItemWeight(Number(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditItemOpen(false)}>Cancelar</Button>
              <Button onClick={handleEditItem}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleDeleteItem}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default ChecklistsManager;
