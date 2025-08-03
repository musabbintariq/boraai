import { useState, useCallback } from "react";

export interface OptimisticUpdateOptions<T> {
  onRevert?: (items: T[]) => void;
  onError?: (error: Error) => void;
}

export const useOptimisticUpdates = <T extends { id: string }>(
  initialItems: T[] = []
) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [optimisticOperations, setOptimisticOperations] = useState<Set<string>>(new Set());

  const addOptimistically = useCallback(async (
    newItem: T,
    persistFn: () => Promise<T>,
    options: OptimisticUpdateOptions<T> = {}
  ) => {
    // Add optimistically
    setItems(prev => [newItem, ...prev]);
    setOptimisticOperations(prev => new Set(prev).add(newItem.id));

    try {
      const persistedItem = await persistFn();
      
      // Update with persisted data
      setItems(prev => prev.map(item => 
        item.id === newItem.id ? persistedItem : item
      ));
    } catch (error) {
      // Revert on error
      setItems(prev => prev.filter(item => item.id !== newItem.id));
      options.onError?.(error instanceof Error ? error : new Error("Operation failed"));
    } finally {
      setOptimisticOperations(prev => {
        const next = new Set(prev);
        next.delete(newItem.id);
        return next;
      });
    }
  }, []);

  const updateOptimistically = useCallback(async (
    id: string,
    updates: Partial<T>,
    persistFn: () => Promise<T>,
    options: OptimisticUpdateOptions<T> = {}
  ) => {
    const originalItems = [...items];
    
    // Update optimistically
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setOptimisticOperations(prev => new Set(prev).add(id));

    try {
      const persistedItem = await persistFn();
      
      // Update with persisted data
      setItems(prev => prev.map(item => 
        item.id === id ? persistedItem : item
      ));
    } catch (error) {
      // Revert on error
      setItems(originalItems);
      options.onRevert?.(originalItems);
      options.onError?.(error instanceof Error ? error : new Error("Update failed"));
    } finally {
      setOptimisticOperations(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [items]);

  const removeOptimistically = useCallback(async (
    id: string,
    persistFn: () => Promise<void>,
    options: OptimisticUpdateOptions<T> = {}
  ) => {
    const originalItems = [...items];
    const itemToRemove = items.find(item => item.id === id);
    
    if (!itemToRemove) return;

    // Remove optimistically
    setItems(prev => prev.filter(item => item.id !== id));
    setOptimisticOperations(prev => new Set(prev).add(id));

    try {
      await persistFn();
    } catch (error) {
      // Revert on error
      setItems(originalItems);
      options.onRevert?.(originalItems);
      options.onError?.(error instanceof Error ? error : new Error("Remove failed"));
    } finally {
      setOptimisticOperations(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [items]);

  const isOptimistic = useCallback((id: string) => {
    return optimisticOperations.has(id);
  }, [optimisticOperations]);

  return {
    items,
    setItems,
    addOptimistically,
    updateOptimistically,
    removeOptimistically,
    isOptimistic
  };
};