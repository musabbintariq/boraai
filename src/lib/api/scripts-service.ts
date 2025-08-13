import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { formatScript } from "@/lib/formatters/data-formatters";

export interface Script {
  id: string;
  user_id: string;
  title: string;
  script: string;
  duration?: string;
  platform: string;
  tags: string[];
  brand_id?: string;
  created_at: string;
  updated_at: string;
  createdAt: string; // for backward compatibility
}

export interface ScriptCreateData {
  title: string;
  script: string;
  duration?: string;
  platform: string;
  tags: string[];
}

export interface ScriptUpdateData {
  title?: string;
  script?: string;
  duration?: string;
  platform?: string;
  tags?: string[];
}

export class ScriptsService {
  constructor(
    private user: User | null,
    private activeBrandId: string | null = null
  ) {}

  async fetchAll(): Promise<Script[]> {
    if (!this.user) throw new Error("User not authenticated");

    let query = supabase
      .from("scripts")
      .select("*")
      .order("created_at", { ascending: false });

    if (this.activeBrandId) {
      query = query.eq("brand_id", this.activeBrandId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(formatScript);
  }

  async create(createData: ScriptCreateData): Promise<Script> {
    if (!this.user) throw new Error("User not authenticated");

    const dataToInsert: any = {
      user_id: this.user.id,
      ...createData
    };

    if (this.activeBrandId) {
      dataToInsert.brand_id = this.activeBrandId;
    }

    const { data, error } = await supabase
      .from("scripts")
      .insert(dataToInsert)
      .select()
      .single();

    if (error) throw error;
    return formatScript(data);
  }

  async update(id: string, updateData: ScriptUpdateData): Promise<Script> {
    if (!this.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("scripts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return formatScript(data);
  }

  async remove(id: string): Promise<void> {
    if (!this.user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("scripts")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}