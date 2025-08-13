import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { formatContentIdea } from "@/lib/formatters/data-formatters";

export interface ContentIdea {
  id: string;
  user_id: string;
  title: string;
  content: string;
  platform: string;
  tags: string[];
  brand_id?: string;
  created_at: string;
  updated_at: string;
  createdAt: string; // for backward compatibility
}

export interface ContentIdeaCreateData {
  title: string;
  content: string;
  platform: string;
  tags: string[];
}

export interface ContentIdeaUpdateData {
  title?: string;
  content?: string;
  platform?: string;
  tags?: string[];
}

export class ContentIdeasService {
  constructor(
    private user: User | null,
    private activeBrandId: string | null = null
  ) {}

  async fetchAll(): Promise<ContentIdea[]> {
    if (!this.user) throw new Error("User not authenticated");

    let query = supabase
      .from("content_ideas")
      .select("*")
      .order("created_at", { ascending: false });

    // Always filter by brand_id - either specific brand or null for no brand
    if (this.activeBrandId) {
      query = query.eq("brand_id", this.activeBrandId);
    } else {
      query = query.is("brand_id", null);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(formatContentIdea);
  }

  async create(createData: ContentIdeaCreateData): Promise<ContentIdea> {
    if (!this.user) throw new Error("User not authenticated");

    const dataToInsert: any = {
      user_id: this.user.id,
      ...createData
    };

    if (this.activeBrandId) {
      dataToInsert.brand_id = this.activeBrandId;
    }

    const { data, error } = await supabase
      .from("content_ideas")
      .insert(dataToInsert)
      .select()
      .single();

    if (error) throw error;
    return formatContentIdea(data);
  }

  async update(id: string, updateData: ContentIdeaUpdateData): Promise<ContentIdea> {
    if (!this.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("content_ideas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return formatContentIdea(data);
  }

  async remove(id: string): Promise<void> {
    if (!this.user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("content_ideas")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}