import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface AsyncOperationState {
  isLoading: boolean;
  error: string | null;
}

export interface UseAsyncOperationOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useAsyncOperation = () => {
  const { toast } = useToast();
  const [state, setState] = useState<AsyncOperationState>({
    isLoading: false,
    error: null
  });

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options: UseAsyncOperationOptions = {}
  ): Promise<T | null> => {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage = "Operation failed"
    } = options;

    setState({ isLoading: true, error: null });

    try {
      const result = await operation();
      
      setState({ isLoading: false, error: null });
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      
      setState({ isLoading: false, error: errorMsg });
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      
      onError?.(error instanceof Error ? error : new Error(errorMsg));
      return null;
    }
  }, [toast]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};