import { useEffect } from "react";
import { useAuth } from "../useAuth";
import { useAsyncOperation } from "../shared/useAsyncOperation";
import { useOptimisticUpdates } from "../shared/useOptimisticUpdates";
import { BaseCrudService } from "@/lib/api/base-crud";
import { formatScript } from "@/lib/formatters/data-formatters";

export interface Script {
  id: string;
  user_id: string;
  title: string;
  script: string;
  duration?: string;
  platform: string;
  tags: string[];
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

export const useScriptsOptimized = () => {
  const { user } = useAuth();
  const { isLoading, execute } = useAsyncOperation();
  const { 
    items: scripts, 
    setItems,
    addOptimistically,
    updateOptimistically,
    removeOptimistically,
    isOptimistic 
  } = useOptimisticUpdates<Script>();

  const service = new BaseCrudService<Script, ScriptCreateData, ScriptUpdateData>(
    "scripts",
    user,
    formatScript
  );

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
  }, [user]);

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