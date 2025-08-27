import { useEffect } from "react";
import { useAuth } from "../useAuth";
import { useAsyncOperation } from "../shared/useAsyncOperation";
import { useOptimisticUpdates } from "../shared/useOptimisticUpdates";
import { useBrandContext } from "@/contexts/BrandContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ScriptsService, 
  Script, 
  ScriptCreateData, 
  ScriptUpdateData 
} from "@/lib/api/scripts-service";

// Re-export types for backward compatibility
export type { Script, ScriptCreateData, ScriptUpdateData } from "@/lib/api/scripts-service";

export const useScriptsOptimized = () => {
  const { user } = useAuth();
  const { activeBrandId } = useBrandContext();
  const { isLoading, execute } = useAsyncOperation();
  const { 
    items: scripts, 
    setItems,
    addOptimistically,
    updateOptimistically,
    removeOptimistically,
    isOptimistic 
  } = useOptimisticUpdates<Script>();

  const service = new ScriptsService(user, activeBrandId);

  const fetchScripts = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    await execute(
      () => service.fetchAll(),
      {
        onSuccess: (data) => setItems(data),
        errorMessage: "Failed to load scripts"
      }
    );
  };

  const addScript = async (scriptData: ScriptCreateData) => {
    if (!user) return;

    const tempId = `temp_${Date.now()}`;
    const tempScript: Script = {
      id: tempId,
      user_id: user.id,
      ...scriptData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await addOptimistically(
      tempScript,
      () => service.create(scriptData),
      {
        onError: () => {
          // Error handling is done in useOptimisticUpdates
        }
      }
    );
  };

  const updateScript = async (id: string, updates: ScriptUpdateData) => {
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

  const removeScript = async (id: string) => {
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
    fetchScripts();
  }, [user, activeBrandId]);

  // Real-time subscription for scripts
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('scripts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scripts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time scripts update:', payload);
          // Use the memoized fetchScripts function
          fetchScripts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]); // Remove fetchScripts from dependencies

  return {
    scripts,
    loading: isLoading,
    addScript,
    updateScript,
    removeScript,
    refetch: fetchScripts,
    isOptimistic
  };
};