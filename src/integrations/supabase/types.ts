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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      custom_goals: {
        Row: {
          created_at: string
          current_value: number
          description: string | null
          id: string
          is_completed: boolean
          notes: string | null
          reward_minutes: number
          reward_points: number
          steps: Json | null
          target_date: string | null
          target_value: number
          title: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          description?: string | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          reward_minutes?: number
          reward_points?: number
          steps?: Json | null
          target_date?: string | null
          target_value?: number
          title: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number
          description?: string | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          reward_minutes?: number
          reward_points?: number
          steps?: Json | null
          target_date?: string | null
          target_value?: number
          title?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          color: string
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          completed_tasks: number
          created_at: string
          current_streak: number
          funday_count: number
          fundaysspent: number
          id: string
          level: number
          points: number
          profile_image: string | null
          reward_minutes: number
          status: string
          total_tasks: number
          updated_at: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          completed_tasks?: number
          created_at?: string
          current_streak?: number
          funday_count?: number
          fundaysspent?: number
          id?: string
          level?: number
          points?: number
          profile_image?: string | null
          reward_minutes?: number
          status?: string
          total_tasks?: number
          updated_at?: string
          user_id?: string | null
          user_name?: string
        }
        Update: {
          completed_tasks?: number
          created_at?: string
          current_streak?: number
          funday_count?: number
          fundaysspent?: number
          id?: string
          level?: number
          points?: number
          profile_image?: string | null
          reward_minutes?: number
          status?: string
          total_tasks?: number
          updated_at?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          custom_bar_color: string | null
          custom_color: string | null
          due_date: string
          duration: number
          group_id: string
          id: string
          is_active: boolean
          is_completed: boolean
          is_scheduled: boolean | null
          last_active_timestamp: number | null
          last_interaction_date: string | null
          level: string
          name: string
          notes: string | null
          priority: string | null
          repeat_days: string[]
          reward_points: number | null
          reward_time: number | null
          time_remaining: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_bar_color?: string | null
          custom_color?: string | null
          due_date: string
          duration: number
          group_id: string
          id?: string
          is_active?: boolean
          is_completed?: boolean
          is_scheduled?: boolean | null
          last_active_timestamp?: number | null
          last_interaction_date?: string | null
          level: string
          name: string
          notes?: string | null
          priority?: string | null
          repeat_days?: string[]
          reward_points?: number | null
          reward_time?: number | null
          time_remaining?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_bar_color?: string | null
          custom_color?: string | null
          due_date?: string
          duration?: number
          group_id?: string
          id?: string
          is_active?: boolean
          is_completed?: boolean
          is_scheduled?: boolean | null
          last_active_timestamp?: number | null
          last_interaction_date?: string | null
          level?: string
          name?: string
          notes?: string | null
          priority?: string | null
          repeat_days?: string[]
          reward_points?: number | null
          reward_time?: number | null
          time_remaining?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
