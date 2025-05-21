
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AuditoriaPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const AuditoriaPagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  loading = false
}: AuditoriaPaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Se não há páginas ou apenas uma página, não mostre a paginação
  if (totalPages <= 1) return null;
  
  // Determina as páginas a serem exibidas (máximo 5)
  const getPageNumbers = () => {
    const pages = [];
    // Sempre mostrar a primeira página
    pages.push(1);
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Ajustes para mostrar sempre 3 páginas quando possível
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, 4);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }
    
    // Adicionar separador se necessário
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Adicionar páginas intermediárias
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Adicionar separador se necessário
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Sempre mostrar a última página se houver mais de uma página
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-1 mt-4">
      {/* Botão Anterior */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Números das páginas */}
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            className="h-8 w-8"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={loading}
          >
            {page}
          </Button>
        )
      ))}
      
      {/* Botão Próximo */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AuditoriaPagination;
