
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Upload, Download, Edit, Trash2, Save, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useChecklists } from '@/hooks/useChecklists';
import { ChecklistItem } from '@/services/checklistService';

interface ChecklistItemFormData {
  id?: string;
  descricao: string;
  peso: number;
  obrigatoria: boolean;
  ordem: number;
}

interface CategoryFormData {
  name: string;
  items: ChecklistItemFormData[];
}

const ChecklistsManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hook de checklists
  const { 
    checklists, 
    areas, 
    createChecklist, 
    createManyChecklists, 
    updateChecklist, 
    deleteChecklist,
    deleteChecklistArea
  } = useChecklists();
  
  // Modal states
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [newItemCategoryId, setNewItemCategoryId] = useState<string | null>(null);
  const [newItemQuestion, setNewItemQuestion] = useState('');
  const [newItemWeight, setNewItemWeight] = useState<number>(3);
  const [newItemRequired, setNewItemRequired] = useState<boolean>(false);
  const [newItemOrder, setNewItemOrder] = useState<number>(0);
  
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemCategoryId, setEditItemCategoryId] = useState<string | null>(null);
  const [editItemQuestion, setEditItemQuestion] = useState('');
  const [editItemWeight, setEditItemWeight] = useState<number>(3);
  const [editItemRequired, setEditItemRequired] = useState<boolean>(false);
  const [editItemOrder, setEditItemOrder] = useState<number>(0);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  // File input reference
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Group checklists by area
  const groupedChecklists = React.useMemo(() => {
    const grouped: Record<string, ChecklistItem[]> = {};
    
    checklists.forEach(item => {
      if (!grouped[item.area]) {
        grouped[item.area] = [];
      }
      grouped[item.area].push(item);
    });
    
    return grouped;
  }, [checklists]);

  // Fix: Define proper type for filtered categories as a tuple array with specific types
  type CategoryTuple = [string, ChecklistItem[]];

  // Filter categories and items based on search term
  const filteredCategories = React.useMemo((): CategoryTuple[] => {
    if (!searchTerm) return Object.entries(groupedChecklists) as CategoryTuple[];
    
    return (Object.entries(groupedChecklists).filter(([categoryName, items]) => {
      const categoryMatches = categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      const itemsMatch = items.some(item => 
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return categoryMatches || itemsMatch;
    }).map(([categoryName, items]) => [
      categoryName,
      items.filter(item => 
        searchTerm ? item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) : true
      )
    ])) as CategoryTuple[];
  }, [groupedChecklists, searchTerm]);
  
  // Handler for adding new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create a default item for the new category to ensure it exists
      await createChecklist.mutateAsync({
        area: newCategoryName.trim(),
        descricao: "Item Inicial",
        obrigatoria: false,
        ordem: 1
      });
      
      setNewCategoryName('');
      setIsNewCategoryOpen(false);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  // Handler for editing category
  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || editCategoryId === null) {
      toast({
        title: "Nome inválido",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update all items in the category
      const itemsToUpdate = checklists.filter(item => item.area === editCategoryId);
      
      for (const item of itemsToUpdate) {
        await updateChecklist.mutateAsync({
          id: item.id,
          updates: { area: editCategoryName.trim() }
        });
      }
      
      setEditCategoryName('');
      setEditCategoryId(null);
      setIsEditCategoryOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
    }
  };

  // Handler for adding new item to a category
  const handleAddItem = async () => {
    if (!newItemQuestion.trim() || newItemCategoryId === null) {
      toast({
        title: "Dados inválidos",
        description: "A pergunta não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get the next order number
      const categoryItems = groupedChecklists[newItemCategoryId] || [];
      const nextOrder = categoryItems.length > 0 
        ? Math.max(...categoryItems.map(item => item.ordem || 0)) + 1 
        : 1;
      
      await createChecklist.mutateAsync({
        area: newItemCategoryId,
        descricao: newItemQuestion.trim(),
        obrigatoria: newItemRequired,
        ordem: newItemOrder || nextOrder,
        peso: newItemWeight
      });
      
      setNewItemQuestion('');
      setNewItemWeight(3);
      setNewItemRequired(false);
      setNewItemOrder(0);
      setNewItemCategoryId(null);
      setIsNewItemOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  };

  // Handler for editing an item
  const handleEditItem = async () => {
    if (!editItemQuestion.trim() || editItemId === null) {
      toast({
        title: "Dados inválidos",
        description: "A pergunta não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateChecklist.mutateAsync({
        id: editItemId,
        updates: {
          descricao: editItemQuestion.trim(),
          obrigatoria: editItemRequired,
          ordem: editItemOrder,
          peso: editItemWeight
        }
      });
      
      setEditItemQuestion('');
      setEditItemWeight(3);
      setEditItemRequired(false);
      setEditItemOrder(0);
      setEditItemId(null);
      setEditItemCategoryId(null);
      setIsEditItemOpen(false);
    } catch (error) {
      console.error("Erro ao editar item:", error);
    }
  };

  // Handler for deleting an item
  const handleDeleteItem = async () => {
    if (deleteItemId === null) {
      return;
    }
    
    try {
      await deleteChecklist.mutateAsync(deleteItemId);
      setDeleteItemId(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erro ao excluir item:", error);
    }
  };
  
  // Handler for deleting a category
  const handleDeleteCategory = async () => {
    if (deleteCategoryId === null) {
      return;
    }
    
    try {
      await deleteChecklistArea.mutateAsync(deleteCategoryId);
      setDeleteCategoryId(null);
      setIsDeleteCategoryDialogOpen(false);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  // Handler for importing data from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (Array.isArray(importedData)) {
          // Format expected: [{ area: "name", items: [{ descricao: "text", peso: 3, obrigatoria: false, ordem: 1 }] }]
          const itemsToCreate: Omit<ChecklistItem, 'id'>[] = [];
          
          importedData.forEach(category => {
            const area = category.area || category.categoria || "Importado";
            
            if (Array.isArray(category.items || category.itens)) {
              const items = category.items || category.itens;
              items.forEach((item: any, index: number) => {
                itemsToCreate.push({
                  area,
                  descricao: item.descricao || item.pergunta || "Item importado",
                  obrigatoria: item.obrigatoria || false,
                  ordem: item.ordem || index + 1,
                  peso: item.peso || 3
                });
              });
            }
          });
          
          if (itemsToCreate.length > 0) {
            await createManyChecklists.mutateAsync(itemsToCreate);
            toast({
              title: "Importação concluída",
              description: `${itemsToCreate.length} itens foram importados com sucesso.`
            });
          } else {
            throw new Error("Nenhum item válido encontrado");
          }
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
    if (Object.keys(groupedChecklists).length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Adicione categorias e itens antes de exportar.",
        variant: "destructive"
      });
      return;
    }
    
    const exportData = Object.entries(groupedChecklists).map(([area, items]) => ({
      area,
      items: items.map(item => ({
        descricao: item.descricao,
        peso: item.peso || 3,
        obrigatoria: item.obrigatoria || false,
        ordem: item.ordem || 0
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
                  placeholder="Buscar itens ou categorias..."
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
                filteredCategories.map(([categoryName, items]) => (
                  <Collapsible key={categoryName} defaultOpen={true} className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <CollapsibleTrigger className="font-bold text-lg hover:text-audti-primary flex items-center transition-colors">
                        {categoryName}
                      </CollapsibleTrigger>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewItemCategoryId(categoryName);
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
                            setEditCategoryId(categoryName);
                            setEditCategoryName(categoryName);
                            setIsEditCategoryOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteCategoryId(categoryName);
                            setIsDeleteCategoryDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <CollapsibleContent>
                      {items.length === 0 ? (
                        <p className="text-gray-500 py-2">Nenhum item encontrado</p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div 
                              key={item.id} 
                              className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50"
                            >
                              <div className="space-y-1 flex-1">
                                <p className="font-medium">{item.descricao}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                  <p>Peso: {item.peso || 3}</p>
                                  <p>Ordem: {item.ordem || 0}</p>
                                  {item.obrigatoria && (
                                    <p className="text-audti-primary">Obrigatória</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setEditItemId(item.id);
                                    setEditItemCategoryId(item.area);
                                    setEditItemQuestion(item.descricao);
                                    setEditItemWeight(item.peso || 3);
                                    setEditItemRequired(item.obrigatoria || false);
                                    setEditItemOrder(item.ordem || 0);
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
              <div className="space-y-2">
                <Label htmlFor="new-item-order">Ordem</Label>
                <Input
                  id="new-item-order"
                  type="number"
                  min={0}
                  value={newItemOrder}
                  onChange={(e) => setNewItemOrder(Number(e.target.value))}
                />
                <p className="text-sm text-gray-500">Itens são exibidos em ordem crescente</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="new-item-required"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={newItemRequired}
                  onChange={(e) => setNewItemRequired(e.target.checked)}
                />
                <Label htmlFor="new-item-required">Item obrigatório</Label>
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
                  onChange={(e) => setEditItemWeight(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-order">Ordem</Label>
                <Input
                  id="edit-item-order"
                  type="number"
                  min={0}
                  value={editItemOrder}
                  onChange={(e) => setEditItemOrder(Number(e.target.value))}
                />
                <p className="text-sm text-gray-500">Itens são exibidos em ordem crescente</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-item-required"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={editItemRequired}
                  onChange={(e) => setEditItemRequired(e.target.checked)}
                />
                <Label htmlFor="edit-item-required">Item obrigatório</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditItemOpen(false)}>Cancelar</Button>
              <Button onClick={handleEditItem}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Item Confirmation Dialog */}
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
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                onClick={handleDeleteItem}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Delete Category Confirmation Dialog */}
        <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão de categoria</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir toda esta categoria e todos os seus itens? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                onClick={handleDeleteCategory}
              >
                Excluir Categoria
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default ChecklistsManager;
