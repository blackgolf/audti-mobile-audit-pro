export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auditorias: {
        Row: {
          areas: string[]
          auditor: string
          criterios: Json
          data: string
          descricao: string | null
          finalizada: boolean | null
          finalizada_em: string | null
          finalizada_por: string | null
          finalizada_por_nome: string | null
          id: string
          titulo: string
          user_id: string | null
        }
        Insert: {
          areas?: string[]
          auditor: string
          criterios?: Json
          data: string
          descricao?: string | null
          finalizada?: boolean | null
          finalizada_em?: string | null
          finalizada_por?: string | null
          finalizada_por_nome?: string | null
          id?: string
          titulo: string
          user_id?: string | null
        }
        Update: {
          areas?: string[]
          auditor?: string
          criterios?: Json
          data?: string
          descricao?: string | null
          finalizada?: boolean | null
          finalizada_em?: string | null
          finalizada_por?: string | null
          finalizada_por_nome?: string | null
          id?: string
          titulo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      checklists: {
        Row: {
          area: string
          created_at: string | null
          descricao: string
          id: string
          obrigatoria: boolean | null
          ordem: number | null
          peso: number
          updated_at: string | null
        }
        Insert: {
          area: string
          created_at?: string | null
          descricao: string
          id?: string
          obrigatoria?: boolean | null
          ordem?: number | null
          peso?: number
          updated_at?: string | null
        }
        Update: {
          area?: string
          created_at?: string | null
          descricao?: string
          id?: string
          obrigatoria?: boolean | null
          ordem?: number | null
          peso?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      logs_atividades: {
        Row: {
          acao: string
          criado_em: string | null
          detalhes: Json | null
          id: string
          user_id: string
          usuario_nome: string
        }
        Insert: {
          acao: string
          criado_em?: string | null
          detalhes?: Json | null
          id?: string
          user_id: string
          usuario_nome: string
        }
        Update: {
          acao?: string
          criado_em?: string | null
          detalhes?: Json | null
          id?: string
          user_id?: string
          usuario_nome?: string
        }
        Relationships: []
      }
      respostas_auditoria: {
        Row: {
          auditoria_id: string
          checklist_id: string
          created_at: string | null
          id: string
          justificativa: string | null
          nota: number | null
          respondido_em: string | null
          respondido_por: string | null
          respondido_por_email: string | null
          resposta: string
          updated_at: string | null
        }
        Insert: {
          auditoria_id: string
          checklist_id: string
          created_at?: string | null
          id?: string
          justificativa?: string | null
          nota?: number | null
          respondido_em?: string | null
          respondido_por?: string | null
          respondido_por_email?: string | null
          resposta: string
          updated_at?: string | null
        }
        Update: {
          auditoria_id?: string
          checklist_id?: string
          created_at?: string | null
          id?: string
          justificativa?: string | null
          nota?: number | null
          respondido_em?: string | null
          respondido_por?: string | null
          respondido_por_email?: string | null
          resposta?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "respostas_auditoria_auditoria_id_fkey"
            columns: ["auditoria_id"]
            isOneToOne: false
            referencedRelation: "auditorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_auditoria_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          email: string
          id: string
          nome: string
          papel: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          email: string
          id?: string
          nome: string
          papel: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          email?: string
          id?: string
          nome?: string
          papel?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_initial_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
