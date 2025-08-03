import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface GeneratedIdea {
  id: string;
  user_id: string;
  title: string;
  content: string;
  platform: string;
  tags: string[];
  feedback_status: 'pending' | 'liked' | 'disliked';
  generation_context?: any;
  content_idea_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateIdeaData {
  title: string;
  content: string;
  platform: string;
  tags?: string[];
  generation_context?: any;
}

export const useGeneratedIdeas = () => {
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [pendingIdeas, setPendingIdeas] = useState<GeneratedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGeneratedIdeas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('generated_ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGeneratedIdeas(data || []);
      setPendingIdeas((data || []).filter(idea => idea.feedback_status === 'pending'));
    } catch (error) {
      console.error('Error fetching generated ideas:', error);
      toast({
        title: "Error",
        description: "Failed to load generated ideas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGeneratedIdea = async (ideaData: GenerateIdeaData): Promise<GeneratedIdea | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('generated_ideas')
        .insert({
          user_id: user.id,
          ...ideaData,
          feedback_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const newIdea = data as GeneratedIdea;
      setGeneratedIdeas(prev => [newIdea, ...prev]);
      setPendingIdeas(prev => [newIdea, ...prev]);

      return newIdea;
    } catch (error) {
      console.error('Error saving generated idea:', error);
      toast({
        title: "Error",
        description: "Failed to save generated idea",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateFeedback = async (id: string, feedbackStatus: 'liked' | 'disliked'): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('generated_ideas')
        .update({ feedback_status: feedbackStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setGeneratedIdeas(prev => 
        prev.map(idea => 
          idea.id === id ? { ...idea, feedback_status: feedbackStatus } : idea
        )
      );
      
      // Remove from pending ideas
      setPendingIdeas(prev => prev.filter(idea => idea.id !== id));

      return true;
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast({
        title: "Error",
        description: "Failed to update feedback",
        variant: "destructive",
      });
      return false;
    }
  };

  const likeIdea = async (generatedIdea: GeneratedIdea): Promise<boolean> => {
    if (!user) return false;

    try {
      // First update the feedback status
      const feedbackUpdated = await updateFeedback(generatedIdea.id, 'liked');
      if (!feedbackUpdated) return false;

      // Then save to content_ideas table
      const { data: contentIdea, error: contentError } = await supabase
        .from('content_ideas')
        .insert({
          user_id: user.id,
          title: generatedIdea.title,
          content: generatedIdea.content,
          platform: generatedIdea.platform,
          tags: generatedIdea.tags || []
        })
        .select()
        .single();

      if (contentError) throw contentError;

      // Update the generated idea with the content_idea_id
      const { error: updateError } = await supabase
        .from('generated_ideas')
        .update({ content_idea_id: contentIdea.id })
        .eq('id', generatedIdea.id);

      if (updateError) throw updateError;

      // Update local state
      setGeneratedIdeas(prev => 
        prev.map(idea => 
          idea.id === generatedIdea.id 
            ? { ...idea, content_idea_id: contentIdea.id }
            : idea
        )
      );

      toast({
        title: "Success",
        description: "Idea saved to your library!",
      });

      return true;
    } catch (error) {
      console.error('Error liking idea:', error);
      toast({
        title: "Error",
        description: "Failed to save idea to library",
        variant: "destructive",
      });
      return false;
    }
  };

  const dislikeIdea = async (id: string): Promise<boolean> => {
    return await updateFeedback(id, 'disliked');
  };

  const getNextPendingIdea = (): GeneratedIdea | null => {
    return pendingIdeas[0] || null;
  };

  useEffect(() => {
    fetchGeneratedIdeas();
  }, [user]);

  return {
    generatedIdeas,
    pendingIdeas,
    loading,
    saveGeneratedIdea,
    likeIdea,
    dislikeIdea,
    getNextPendingIdea,
    refetch: fetchGeneratedIdeas
  };
};