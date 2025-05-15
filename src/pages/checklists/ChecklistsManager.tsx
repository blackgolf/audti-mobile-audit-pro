
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Upload, Download, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChecklistsManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock categories and checklist items
  const [categories, setCategories] = useState([
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
  ]);

  // Filter categories and items based on search term
  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || category.items.length > 0
  );

  // Mock function to add new item
  const handleAddItem = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A adição de novos itens será implementada em breve."
    });
  };

  // Mock function to import from Excel/CSV
  const handleImport = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A importação de planilhas será implementada em breve."
    });
  };

  // Mock function to export to Excel/CSV
  const handleExport = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exportação para planilhas será implementada em breve."
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Checklists</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" /> Importar
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Exportar
            </Button>
            <Button onClick={handleAddItem}>
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
              {filteredCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={handleAddItem}>
                        <Plus className="h-4 w-4 mr-1" /> Item
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
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
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma categoria ou item encontrado.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ChecklistsManager;
