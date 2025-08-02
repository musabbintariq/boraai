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
}

export const useScripts = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchScripts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedScripts = data.map(item => ({
        id: item.id,
        title: item.title,
        script: item.script,
        duration: item.duration,
        platform: item.platform,
        tags: item.tags || [],
        createdAt: item.created_at
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
        createdAt: data.created_at
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
  }, [user]);

  return {
    scripts,
    loading,
    addScript,
    updateScript,
    removeScript,
    refetch: fetchScripts
  };
};