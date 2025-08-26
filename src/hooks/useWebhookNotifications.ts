import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WebhookNotification {
  id: string;
  message: string;
  progress: number;
  type: 'script' | 'ideas' | 'general';
}

export const useWebhookNotifications = () => {
  const [notifications, setNotifications] = useState<WebhookNotification[]>([]);
  const { toast } = useToast();
  const progressIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const startNotification = useCallback((type: 'script' | 'ideas' | 'general', message: string) => {
    const id = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newNotification: WebhookNotification = {
      id,
      message,
      progress: 0,
      type
    };

    setNotifications(prev => [...prev, newNotification]);

    // Simulate progress animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15; // Faster initial progress
      if (progress > 85) {
        progress = 85; // Don't complete until we get the actual response
        clearInterval(interval);
        progressIntervals.current.delete(id);
      }
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, progress: Math.min(progress, 85) }
            : notification
        )
      );
    }, 200);

    progressIntervals.current.set(id, interval);
    
    return id;
  }, []);

  const completeNotification = useCallback((id: string, onComplete?: () => void) => {
    // Clear any running interval
    const interval = progressIntervals.current.get(id);
    if (interval) {
      clearInterval(interval);
      progressIntervals.current.delete(id);
    }

    // Complete the progress bar
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, progress: 100 }
          : notification
      )
    );

    // Remove notification after animation completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      onComplete?.();
    }, 1000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    // Clear any running interval
    const interval = progressIntervals.current.get(id);
    if (interval) {
      clearInterval(interval);
      progressIntervals.current.delete(id);
    }

    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    // Clear all intervals
    progressIntervals.current.forEach(interval => clearInterval(interval));
    progressIntervals.current.clear();
    setNotifications([]);
  }, []);

  return {
    notifications,
    startNotification,
    completeNotification,
    removeNotification,
    clearAllNotifications
  };
};