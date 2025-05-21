
// Custom types for working with auditorias data
export interface Criterio {
  descricao: string;
  nota: number;
  justificativa: string;
}

export interface Auditoria {
  id?: string;
  titulo: string;
  descricao?: string | null;
  data: string;
  auditor: string;
  areas: string[];
  criterios: Criterio[];
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
