export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          assigned_to: string | null
          category_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          workstation_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          workstation_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          workstation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kpi_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_workstation_id_fkey"
            columns: ["workstation_id"]
            isOneToOne: false
            referencedRelation: "workstations"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      kpi_categories: {
        Row: {
          code: string
          color: string
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          color: string
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          color?: string
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      kpi_history: {
        Row: {
          id: string
          kpi_id: string
          recorded_at: string
          recorded_by: string | null
          value: number
        }
        Insert: {
          id?: string
          kpi_id: string
          recorded_at?: string
          recorded_by?: string | null
          value: number
        }
        Update: {
          id?: string
          kpi_id?: string
          recorded_at?: string
          recorded_by?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_history_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          current_value: number
          description: string | null
          frequency: string | null
          id: string
          name: string
          status: string | null
          target_value: number
          trend: string | null
          unit: string | null
          updated_at: string
          workstation_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          current_value?: number
          description?: string | null
          frequency?: string | null
          id?: string
          name: string
          status?: string | null
          target_value?: number
          trend?: string | null
          unit?: string | null
          updated_at?: string
          workstation_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          current_value?: number
          description?: string | null
          frequency?: string | null
          id?: string
          name?: string
          status?: string | null
          target_value?: number
          trend?: string | null
          unit?: string | null
          updated_at?: string
          workstation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kpi_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpis_workstation_id_fkey"
            columns: ["workstation_id"]
            isOneToOne: false
            referencedRelation: "workstations"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          related_id: string | null
          related_type: string | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
        }
        Relationships: []
      }
      problems: {
        Row: {
          assigned_to: string | null
          category_id: string | null
          created_at: string
          description: string | null
          escalated_at: string | null
          id: string
          is_escalated: boolean | null
          reported_by: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string
          workstation_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          escalated_at?: string | null
          id?: string
          is_escalated?: boolean | null
          reported_by?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string
          workstation_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          escalated_at?: string | null
          id?: string
          is_escalated?: boolean | null
          reported_by?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          workstation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problems_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kpi_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_workstation_id_fkey"
            columns: ["workstation_id"]
            isOneToOne: false
            referencedRelation: "workstations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workstations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "team_leader" | "operator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "team_leader", "operator"],
    },
  },
} as const
