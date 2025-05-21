
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AuditoriaFilters as AuditoriaFiltersType } from '@/hooks/useAuditorias';
import { auditoriaService } from '@/services/auditoriaService';
import { Search, ChevronDown, Filter, CalendarRange, SortAscending, SortDescending } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditoriaFiltersProps {
  onFilterChange: (filters: AuditoriaFiltersType) => void;
  loading: boolean;
}

const AuditoriaFilters = ({ onFilterChange, loading }: AuditoriaFiltersProps) => {
  // Estado para áreas disponíveis
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [availableUnidades, setAvailableUnidades] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Estados para os filtros
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedUnidade, setSelectedUnidade] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();
  const [busca, setBusca] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState<{ campo: 'data' | 'titulo', ordem: 'asc' | 'desc' }>({
    campo: 'data',
    ordem: 'desc'
  });
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina] = useState(10);

  // Carregar áreas e unidades disponíveis
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const [areas, unidades] = await Promise.all([
          auditoriaService.getAreas(),
          auditoriaService.getUnidades()
        ]);
        
        setAvailableAreas(areas);
        setAvailableUnidades(unidades);
      } catch (error) {
        console.error('Erro ao carregar dados dos filtros:', error);
      }
    };

    loadFiltersData();
  }, []);

  // Aplica os filtros quando qualquer estado de filtro mudar
  useEffect(() => {
    // Formatar datas para string ISO
    const formatarData = (data?: Date) => {
      return data ? format(data, 'yyyy-MM-dd') : undefined;
    };

    onFilterChange({
      areas: selectedAreas.length > 0 ? selectedAreas : undefined,
      unidade: selectedUnidade || undefined,
      dataInicio: formatarData(dataInicio),
      dataFim: formatarData(dataFim),
      busca: busca || undefined,
      ordenacao: ordenacao,
      pagina: pagina,
      itensPorPagina: itensPorPagina
    });
  }, [
    selectedAreas, 
    selectedUnidade, 
    dataInicio, 
    dataFim, 
    busca, 
    ordenacao, 
    pagina, 
    itensPorPagina,
    onFilterChange
  ]);

  // Manipuladores para checkbox de áreas
  const handleAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setSelectedAreas(prev => [...prev, area]);
    } else {
      setSelectedAreas(prev => prev.filter(a => a !== area));
    }
    // Sempre volta para a primeira página quando mudar os filtros
    setPagina(1);
  };

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSelectedAreas([]);
    setSelectedUnidade('');
    setDataInicio(undefined);
    setDataFim(undefined);
    setBusca('');
    setOrdenacao({ campo: 'data', ordem: 'desc' });
    setPagina(1);
  };

  // Função para alternar a ordem de ordenação
  const toggleSortOrder = (campo: 'data' | 'titulo') => {
    if (ordenacao.campo === campo) {
      setOrdenacao({
        campo,
        ordem: ordenacao.ordem === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setOrdenacao({
        campo,
        ordem: 'asc'
      });
    }
    setPagina(1);
  };

  return (
    <div className="space-y-4">
      {/* Campo de busca e botão de filtros */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por título, descrição ou auditor..."
            className="pl-8"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className={cn(
              "min-w-24",
              isFiltersOpen && "border-audti-primary text-audti-primary"
            )}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            disabled={loading}
          >
            <Filter className="mr-2 h-4 w-4" /> 
            Filtros
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleSortOrder('data')}
            className={cn(
              ordenacao.campo === 'data' && "border-audti-primary text-audti-primary",
              "md:flex hidden"
            )}
            disabled={loading}
          >
            Data
            {ordenacao.campo === 'data' && ordenacao.ordem === 'asc' ? (
              <SortAscending className="ml-1 h-4 w-4" />
            ) : (
              <SortDescending className="ml-1 h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleSortOrder('titulo')}
            className={cn(
              ordenacao.campo === 'titulo' && "border-audti-primary text-audti-primary",
              "md:flex hidden"
            )}
            disabled={loading}
          >
            Título
            {ordenacao.campo === 'titulo' && ordenacao.ordem === 'asc' ? (
              <SortAscending className="ml-1 h-4 w-4" />
            ) : (
              <SortDescending className="ml-1 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Painel de filtros avançados */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent className="space-y-4 border rounded-md p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Áreas */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Áreas</Label>
              <div className="max-h-36 overflow-y-auto space-y-2 border rounded-md p-2">
                {availableAreas.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`area-${area}`} 
                      checked={selectedAreas.includes(area)}
                      onCheckedChange={(checked) => 
                        handleAreaChange(area, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`area-${area}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {area}
                    </label>
                  </div>
                ))}
                {availableAreas.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Nenhuma área disponível</p>
                )}
              </div>
            </div>

            {/* Filtro por Unidade */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Unidade</Label>
              <Select value={selectedUnidade} onValueChange={(value) => {
                setSelectedUnidade(value);
                setPagina(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {availableUnidades.map(unidade => (
                    <SelectItem key={unidade} value={unidade}>{unidade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Período */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Período</Label>
              <div className="flex gap-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal h-10"
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {dataInicio ? (
                        dataFim ? (
                          <>
                            {format(dataInicio, 'dd/MM/yyyy')} até {format(dataFim, 'dd/MM/yyyy')}
                          </>
                        ) : (
                          <>A partir de {format(dataInicio, 'dd/MM/yyyy')}</>
                        )
                      ) : dataFim ? (
                        <>Até {format(dataFim, 'dd/MM/yyyy')}</>
                      ) : (
                        "Selecione as datas"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: dataInicio,
                        to: dataFim
                      }}
                      onSelect={(range) => {
                        setDataInicio(range?.from);
                        setDataFim(range?.to);
                        setPagina(1);
                      }}
                      locale={ptBR}
                      className="pointer-events-auto"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Ordenação Mobile */}
          <div className="md:hidden">
            <Label className="text-sm font-medium">Ordenação</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => toggleSortOrder('data')}
                className={cn(
                  ordenacao.campo === 'data' && "border-audti-primary text-audti-primary"
                )}
              >
                Data
                {ordenacao.campo === 'data' && ordenacao.ordem === 'asc' ? (
                  <SortAscending className="ml-1 h-4 w-4" />
                ) : (
                  <SortDescending className="ml-1 h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleSortOrder('titulo')}
                className={cn(
                  ordenacao.campo === 'titulo' && "border-audti-primary text-audti-primary"
                )}
              >
                Título
                {ordenacao.campo === 'titulo' && ordenacao.ordem === 'asc' ? (
                  <SortAscending className="ml-1 h-4 w-4" />
                ) : (
                  <SortDescending className="ml-1 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              disabled={loading}
            >
              Limpar filtros
            </Button>
            <Button 
              onClick={() => setIsFiltersOpen(false)}
              disabled={loading}
            >
              Aplicar filtros
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AuditoriaFilters;
