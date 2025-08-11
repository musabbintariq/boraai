import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Script {
  id: string;
  title: string;
  script: string;
  duration?: string;
  platform: string;
  tags: string[];
  createdAt: string;
  brandId?: string;
}

export const useScripts = (brandId?: string | null) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchScripts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from("scripts")
        .select("*");
      
      // Filter by brand if brandId is provided
      if (brandId) {
        query = query.eq("brand_id", brandId);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      const formattedScripts = data.map(item => ({
        id: item.id,
        title: item.title,
        script: item.script,
        duration: item.duration,
        platform: item.platform,
        tags: item.tags || [],
        createdAt: item.created_at,
        brandId: item.brand_id
      }));

      setScripts(formattedScripts);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      toast({
        title: "Error",
        description: "Failed to load scripts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addScript = async (scriptData: Omit<Script, "id" | "createdAt">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("scripts")
        .insert({
          user_id: user.id,
          brand_id: scriptData.brandId || null,
          title: scriptData.title,
          script: scriptData.script,
          duration: scriptData.duration,
          platform: scriptData.platform,
          tags: scriptData.tags
        })
        .select()
        .single();

      if (error) throw error;

      const newScript = {
        id: data.id,
        title: data.title,
        script: data.script,
        duration: data.duration,
        platform: data.platform,
        tags: data.tags || [],
        createdAt: data.created_at,
        brandId: data.brand_id
      };

      setScripts(prev => [newScript, ...prev]);
      toast({
        title: "Success",
        description: "Script added successfully",
      });
    } catch (error) {
      console.error("Error adding script:", error);
      toast({
        title: "Error",
        description: "Failed to add script",
        variant: "destructive",
      });
    }
  };

  const updateScript = async (id: string, updates: Partial<Omit<Script, "id" | "createdAt">>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("scripts")
        .update({
          title: updates.title,
          script: updates.script,
          duration: updates.duration,
          platform: updates.platform,
          tags: updates.tags
        })
        .eq("id", id);

      if (error) throw error;

      setScripts(prev => prev.map(script => 
        script.id === id ? { ...script, ...updates } : script
      ));

      toast({
        title: "Success",
        description: "Script updated successfully",
      });
    } catch (error) {
      console.error("Error updating script:", error);
      toast({
        title: "Error",
        description: "Failed to update script",
        variant: "destructive",
      });
    }
  };

  const removeScript = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("scripts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setScripts(prev => prev.filter(script => script.id !== id));
      toast({
        title: "Success",
        description: "Script removed successfully",
      });
    } catch (error) {
      console.error("Error removing script:", error);
      toast({
        title: "Error",
        description: "Failed to remove script",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchScripts();
    } else {
      setScripts([]);
      setLoading(false);
    }
  }, [user, brandId]);

  return {
    scripts,
    loading,
    addScript,
    updateScript,
    removeScript,
    refetch: fetchScripts
  };
};