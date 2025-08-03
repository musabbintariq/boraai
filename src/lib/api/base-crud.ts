import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface BaseEntity {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CrudOperations<T extends BaseEntity, TCreate, TUpdate> {
  fetchAll: () => Promise<T[]>;
  create: (data: TCreate) => Promise<T>;
  update: (id: string, data: TUpdate) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export class BaseCrudService<T extends BaseEntity, TCreate, TUpdate> 
  implements CrudOperations<T, TCreate, TUpdate> {
  
  constructor(
    private tableName: "content_ideas" | "scripts" | "profiles" | "generated_ideas",
    private user: User | null,
    private formatter: (data: any) => T
  ) {}

  async fetchAll(): Promise<T[]> {
    if (!this.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return data.map(this.formatter);
  }

  async create(createData: TCreate): Promise<T> {
    if (!this.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        user_id: this.user.id,
        ...createData
      })
      .select()
      .single();

    if (error) throw error;
    
    return this.formatter(data);
  }

  async update(id: string, updateData: TUpdate): Promise<T> {
    if (!this.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    return this.formatter(data);
  }

  async remove(id: string): Promise<void> {
    if (!this.user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}