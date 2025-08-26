import { createContext, useContext, type ReactNode } from "react";
import { useWebhookNotifications } from "@/hooks/useWebhookNotifications";
import { WebhookNotificationContainer } from "@/components/notifications/WebhookNotificationContainer";

type WebhookNotificationContextType = ReturnType<typeof useWebhookNotifications>;

const WebhookNotificationContext = createContext<WebhookNotificationContextType | null>(null);

export function WebhookNotificationProvider({ children }: { children: ReactNode }) {
  const webhookNotifications = useWebhookNotifications();

  return (
    <WebhookNotificationContext.Provider value={webhookNotifications}>
      {children}
      <WebhookNotificationContainer />
    </WebhookNotificationContext.Provider>
  );
}

export function useWebhookNotificationContext() {
  const context = useContext(WebhookNotificationContext);
  if (!context) {
    throw new Error("useWebhookNotificationContext must be used within WebhookNotificationProvider");
  }
  return context;
}