
// Custom types for working with auditorias data
export interface Criterio {
  descricao: string;
  nota: number;
  justificativa: string;
  checklist_id?: string; // ID do item do checklist associado
}

export interface Auditoria {
  id?: string;
  titulo: string;
  descricao?: string | null;
  data: string;
  auditor: string;
  areas: string[];
  criterios: Criterio[];
  user_id?: string;
}

export interface AuditoriaInput {
  titulo: string;
  descricao?: string | null;
  data: string;
  auditor: string;
  areas: string[];
  criterios: Criterio[];
}

export interface AuditoriaUpdate {
  titulo?: string;
  descricao?: string | null;
  data?: string;
  auditor?: string;
  areas?: string[];
  criterios?: Criterio[];
}
