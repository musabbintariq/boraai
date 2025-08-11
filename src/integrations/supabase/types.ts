export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      brand_voice_profiles: {
        Row: {
          brand_id: string
          brand_name: string | null
          communication_style: string | null
          created_at: string
          do_use: string[] | null
          dont_use: string[] | null
          id: string
          personality_traits: string[] | null
          tone: string | null
          updated_at: string
          values: string | null
          voice_description: string | null
        }
        Insert: {
          brand_id: string
          brand_name?: string | null
          communication_style?: string | null
          created_at?: string
          do_use?: string[] | null
          dont_use?: string[] | null
          id?: string
          personality_traits?: string[] | null
          tone?: string | null
          updated_at?: string
          values?: string | null
          voice_description?: string | null
        }
        Update: {
          brand_id?: string
          brand_name?: string | null
          communication_style?: string | null
          created_at?: string
          do_use?: string[] | null
          dont_use?: string[] | null
          id?: string
          personality_traits?: string[] | null
          tone?: string | null
          updated_at?: string
          values?: string | null
          voice_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_voice_profiles_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
      brands: {
        Row: {
          brand_id: string
          created_at: string
          description: string | null
          industry: string | null
          name: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          brand_id?: string
          created_at?: string
          description?: string | null
          industry?: string | null
          name: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string
          description?: string | null
          industry?: string | null
          name?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      content_ideas: {
        Row: {
          brand_id: string | null
          content: string
          created_at: string
          id: string
          platform: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_id?: string | null
          content: string
          created_at?: string
          id?: string
          platform: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_id?: string | null
          content?: string
          created_at?: string
          id?: string
          platform?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_ideas_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
      generated_ideas: {
        Row: {
          content: string
          content_idea_id: string | null
          created_at: string
          feedback_status: Database["public"]["Enums"]["feedback_status_enum"]
          generation_context: Json | null
          id: string
          platform: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          content_idea_id?: string | null
          created_at?: string
          feedback_status?: Database["public"]["Enums"]["feedback_status_enum"]
          generation_context?: Json | null
          id?: string
          platform: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          content_idea_id?: string | null
          created_at?: string
          feedback_status?: Database["public"]["Enums"]["feedback_status_enum"]
          generation_context?: Json | null
          id?: string
          platform?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_ideas_content_idea_id_fkey"
            columns: ["content_idea_id"]
            isOneToOne: false
            referencedRelation: "content_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          plan: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          plan?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          plan?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scripts: {
        Row: {
          brand_id: string | null
          created_at: string
          duration: string | null
          id: string
          platform: string
          script: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          platform: string
          script: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          platform?: string
          script?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
      target_audience_profiles: {
        Row: {
          brand_id: string
          communication_style: string | null
          content_preferences: string[] | null
          created_at: string
          demographics: Json | null
          goals: string[] | null
          id: string
          niche_description: string | null
          pain_points: string[] | null
          preferred_platforms: string[] | null
          psychographics: Json | null
          updated_at: string
        }
        Insert: {
          brand_id: string
          communication_style?: string | null
          content_preferences?: string[] | null
          created_at?: string
          demographics?: Json | null
          goals?: string[] | null
          id?: string
          niche_description?: string | null
          pain_points?: string[] | null
          preferred_platforms?: string[] | null
          psychographics?: Json | null
          updated_at?: string
        }
        Update: {
          brand_id?: string
          communication_style?: string | null
          content_preferences?: string[] | null
          created_at?: string
          demographics?: Json | null
          goals?: string[] | null
          id?: string
          niche_description?: string | null
          pain_points?: string[] | null
          preferred_platforms?: string[] | null
          psychographics?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "target_audience_profiles_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_brand_owner: {
        Args: { brand_uuid: string }
        Returns: string
      }
    }
    Enums: {
      feedback_status_enum: "pending" | "liked" | "disliked"
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
      feedback_status_enum: ["pending", "liked", "disliked"],
    },
  },
} as const
