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
      expense_splits: {
        Row: {
          amount: number
          created_at: string
          expense_id: string
          friend_id: string
          id: string
          percentage: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          expense_id: string
          friend_id: string
          id?: string
          percentage?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          expense_id?: string
          friend_id?: string
          id?: string
          percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_splits_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          group_id: string | null
          id: string
          paid_by: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          description: string
          group_id?: string | null
          id?: string
          paid_by: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          group_id?: string | null
          id?: string
          paid_by?: string
          user_id?: string
        }
        Relationships: []
      }
      friend_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_complete: boolean | null
          is_invited: boolean | null
          name: string
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_complete?: boolean | null
          is_invited?: boolean | null
          name: string
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_complete?: boolean | null
          is_invited?: boolean | null
          name?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          created_at: string
          friend_id: string
          group_id: string
          id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          group_id: string
          id?: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "friend_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_number: string | null
          created_at: string
          expiry_date: string | null
          id: string
          is_default: boolean
          last_four: string | null
          name: string
          phone_number: string | null
          type: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_default?: boolean
          last_four?: string | null
          name: string
          phone_number?: string | null
          type: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_default?: boolean
          last_four?: string | null
          name?: string
          phone_number?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_provider_settings: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          provider: string
          settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          provider: string
          settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          provider?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_reminders: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          from_friend_id: string
          id: string
          is_paid: boolean
          is_read: boolean
          message: string | null
          to_friend_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          from_friend_id: string
          id?: string
          is_paid?: boolean
          is_read?: boolean
          message?: string | null
          to_friend_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          from_friend_id?: string
          id?: string
          is_paid?: boolean
          is_read?: boolean
          message?: string | null
          to_friend_id?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          date: string
          from_friend_id: string
          id: string
          method: string
          payment_method_id: string | null
          payment_status: string | null
          paypal_payment_id: string | null
          receipt_url: string | null
          status: string
          stripe_payment_id: string | null
          to_friend_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          from_friend_id: string
          id?: string
          method: string
          payment_method_id?: string | null
          payment_status?: string | null
          paypal_payment_id?: string | null
          receipt_url?: string | null
          status: string
          stripe_payment_id?: string | null
          to_friend_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          from_friend_id?: string
          id?: string
          method?: string
          payment_method_id?: string | null
          payment_status?: string | null
          paypal_payment_id?: string | null
          receipt_url?: string | null
          status?: string
          stripe_payment_id?: string | null
          to_friend_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          currency: string
          full_name: string | null
          id: string
          phone_numbers: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          full_name?: string | null
          id?: string
          phone_numbers?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          full_name?: string | null
          id?: string
          phone_numbers?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
