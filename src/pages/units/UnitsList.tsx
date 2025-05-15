
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnitsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock units data
  const units = [
    { 
      id: 1, 
      name: 'Brasal Refrigerantes - Matriz', 
      address: 'SIA Trecho 3, Lote 625/695, Brasília-DF', 
      manager: 'Rodrigo Oliveira',
      lastAudit: '15/05/2025',
      lastScore: 4.8
    },
    { 
      id: 2, 
      name: 'Brasal Combustíveis - Asa Norte', 
      address: 'SCRN 704/705 Bloco C, Brasília-DF', 
      manager: 'Camila Souza',
      lastAudit: '14/05/2025',
      lastScore: 3.9
    },
    { 
      id: 3, 
      name: 'Brasal Veículos - Taguatinga', 
      address: 'Av. Samdu Sul, Taguatinga-DF', 
      manager: 'Fernando Melo',
      lastAudit: '12/05/2025',
      lastScore: 4.5
    },
    { 
      id: 4, 
      name: 'Brasal Incorporações - Sede', 
      address: 'SCRN 704/705 Bloco A, Brasília-DF', 
      manager: 'Patricia Lima',
      lastAudit: '10/05/2025',
      lastScore: 3.2
    },
    { 
      id: 5, 
      name: 'Brasal Refrigerantes - Gama', 
      address: 'Setor Leste Industrial, Gama-DF', 
      manager: 'Lucas Castro',
      lastAudit: '08/05/2025',
      lastScore: 4.0
    },
    { 
      id: 6, 
      name: 'Brasal Combustíveis - Sudoeste', 
      address: 'CLSW 300B Bloco 02, Brasília-DF', 
      manager: 'Juliana Martins',
      lastAudit: '05/05/2025',
      lastScore: 4.6
    },
  ];

  const filteredUnits = searchTerm 
    ? units.filter(unit => 
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.manager.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : units;

  const startAudit = (unitId: number) => {
    navigate(`/audits/new?unitId=${unitId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Unidades</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Nova Unidade
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Unidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar unidades..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filtrar</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredUnits.map((unit) => (
                <Card key={unit.id} className="overflow-hidden">
                  <div className="p-4 border-l-4 border-audti-secondary">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{unit.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{unit.address}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => startAudit(unit.id)}
                      >
                        Auditar
                      </Button>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Responsável: <span className="font-medium">{unit.manager}</span>
                      </span>
                      {unit.lastAudit && (
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            Última auditoria: {unit.lastAudit}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-gray-100 font-medium">
                            {unit.lastScore} / 5
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UnitsList;
