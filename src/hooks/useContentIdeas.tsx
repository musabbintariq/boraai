import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface ContentIdea {
  id: string;
  title: string;
  content: string;
  platform: string;
  tags: string[];
  createdAt: string;
}

export const useContentIdeas = () => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchIdeas = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("content_ideas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedIdeas = data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        platform: item.platform,
        tags: item.tags || [],
        createdAt: item.created_at
      }));

      setIdeas(formattedIdeas);
    } catch (error) {
      console.error("Error fetching content ideas:", error);
      toast({
        title: "Error",
        description: "Failed to load content ideas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addIdea = async (ideaData: Omit<ContentIdea, "id" | "createdAt">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("content_ideas")
        .insert({
          user_id: user.id,
          title: ideaData.title,
          content: ideaData.content,
          platform: ideaData.platform,
          tags: ideaData.tags
        })
        .select()
        .single();

      if (error) throw error;

      const newIdea = {
        id: data.id,
        title: data.title,
        content: data.content,
        platform: data.platform,
        tags: data.tags || [],
        createdAt: data.created_at
      };

      setIdeas(prev => [newIdea, ...prev]);
      toast({
        title: "Success",
        description: "Content idea added successfully",
      });
    } catch (error) {
      console.error("Error adding content idea:", error);
      toast({
        title: "Error",
        description: "Failed to add content idea",
        variant: "destructive",
      });
    }
  };

  const updateIdea = async (id: string, updates: Partial<Omit<ContentIdea, "id" | "createdAt">>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("content_ideas")
        .update({
          title: updates.title,
          content: updates.content,
          platform: updates.platform,
          tags: updates.tags
        })
        .eq("id", id);

      if (error) throw error;

      setIdeas(prev => prev.map(idea => 
        idea.id === id ? { ...idea, ...updates } : idea
      ));

      toast({
        title: "Success",
        description: "Content idea updated successfully",
      });
    } catch (error) {
      console.error("Error updating content idea:", error);
      toast({
        title: "Error",
        description: "Failed to update content idea",
        variant: "destructive",
      });
    }
  };

  const removeIdea = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("content_ideas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setIdeas(prev => prev.filter(idea => idea.id !== id));
      toast({
        title: "Success",
        description: "Content idea removed successfully",
      });
    } catch (error) {
      console.error("Error removing content idea:", error);
      toast({
        title: "Error",
        description: "Failed to remove content idea",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchIdeas();
    } else {
      setIdeas([]);
      setLoading(false);
    }
  }, [user]);

  return {
    ideas,
    loading,
    addIdea,
    updateIdea,
    removeIdea,
    refetch: fetchIdeas
  };
};