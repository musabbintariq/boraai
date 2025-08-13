import { useEffect } from "react";
import { useAuth } from "../useAuth";
import { useAsyncOperation } from "../shared/useAsyncOperation";
import { useOptimisticUpdates } from "../shared/useOptimisticUpdates";
import { useBrandContext } from "@/contexts/BrandContext";
import { 
  ContentIdeasService, 
  ContentIdea, 
  ContentIdeaCreateData, 
  ContentIdeaUpdateData 
} from "@/lib/api/content-ideas-service";

// Re-export types for backward compatibility
export type { ContentIdea, ContentIdeaCreateData, ContentIdeaUpdateData } from "@/lib/api/content-ideas-service";

export const useContentIdeasOptimized = () => {
  const { user } = useAuth();
  const { activeBrandId } = useBrandContext();
  const { isLoading, execute } = useAsyncOperation();
  const { 
    items: ideas, 
    setItems,
    addOptimistically,
    updateOptimistically,
    removeOptimistically,
    isOptimistic 
  } = useOptimisticUpdates<ContentIdea>();

  const service = new ContentIdeasService(user, activeBrandId);

  const fetchIdeas = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    await execute(
      () => service.fetchAll(),
      {
        onSuccess: (data) => setItems(data),
        errorMessage: "Failed to load content ideas"
      }
    );
  };

  const addIdea = async (ideaData: ContentIdeaCreateData) => {
    if (!user) return;

    const tempId = `temp_${Date.now()}`;
    const tempIdea: ContentIdea = {
      id: tempId,
      user_id: user.id,
      ...ideaData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await addOptimistically(
      tempIdea,
      () => service.create(ideaData),
      {
        onError: () => {
          // Error handling is done in useOptimisticUpdates
        }
      }
    );
  };

  const updateIdea = async (id: string, updates: ContentIdeaUpdateData) => {
    if (!user) return;

    await updateOptimistically(
      id,
      updates,
      () => service.update(id, updates),
      {
        onError: () => {
          // Error handling is done in useOptimisticUpdates
        }
      }
    );
  };

  const removeIdea = async (id: string) => {
    if (!user) return;

    await removeOptimistically(
      id,
      () => service.remove(id),
      {
        onError: () => {
          // Error handling is done in useOptimisticUpdates
        }
      }
    );
  };

  useEffect(() => {
    fetchIdeas();
  }, [user, activeBrandId]);

  return {
    ideas,
    loading: isLoading,
    addIdea,
    updateIdea,
    removeIdea,
    refetch: fetchIdeas,
    isOptimistic
  };
};