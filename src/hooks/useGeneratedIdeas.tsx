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

      // If no data exists, create some mockup data for testing
      let allIdeas = data || [];
      
      if (allIdeas.length === 0) {
        const mockIdeas = [
          {
            id: 'mock-1',
            user_id: user.id,
            title: 'Morning Routine Transformation',
            content: 'Document your morning routine and show how small changes can lead to big productivity gains. Share before/after comparisons and practical tips your audience can implement immediately.',
            platform: 'instagram',
            tags: ['morning-routine', 'productivity', 'lifestyle'],
            feedback_status: 'pending' as const,
            generation_context: { brandName: 'Test Brand', niche: 'Lifestyle' },
            content_idea_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-2',
            user_id: user.id,
            title: 'Industry Myth Busting',
            content: 'Address common misconceptions in your industry. Create engaging content that educates while positioning you as a knowledgeable authority. Use data and real examples to support your points.',
            platform: 'linkedin',
            tags: ['education', 'industry-insights', 'myth-busting'],
            feedback_status: 'pending' as const,
            generation_context: { brandName: 'Test Brand', niche: 'Business' },
            content_idea_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-3',
            user_id: user.id,
            title: 'Behind-the-Scenes: Failed Attempts',
            content: 'Show your audience that success isn\'t always linear. Share a project or idea that didn\'t work out as planned and the valuable lessons learned. Authenticity builds stronger connections.',
            platform: 'youtube',
            tags: ['behind-the-scenes', 'authentic', 'lessons-learned'],
            feedback_status: 'pending' as const,
            generation_context: { brandName: 'Test Brand', niche: 'Entrepreneurship' },
            content_idea_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-4',
            user_id: user.id,
            title: 'Quick Win Tutorial Series',
            content: 'Create bite-sized tutorials that solve specific problems your audience faces. Focus on actionable content that delivers immediate value and can be consumed in under 60 seconds.',
            platform: 'instagram',
            tags: ['tutorial', 'quick-tips', 'value-driven'],
            feedback_status: 'pending' as const,
            generation_context: { brandName: 'Test Brand', niche: 'Education' },
            content_idea_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-5',
            user_id: user.id,
            title: 'Client Transformation Story',
            content: 'Feature a detailed case study of how you helped a client achieve their goals. Include specific metrics, challenges overcome, and the step-by-step process. Social proof at its finest.',
            platform: 'linkedin',
            tags: ['case-study', 'social-proof', 'results'],
            feedback_status: 'pending' as const,
            generation_context: { brandName: 'Test Brand', niche: 'Consulting' },
            content_idea_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        allIdeas = mockIdeas;
      }

      setGeneratedIdeas(allIdeas);
      setPendingIdeas(allIdeas.filter(idea => idea.feedback_status === 'pending'));
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