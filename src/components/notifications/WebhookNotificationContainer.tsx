import { X, FileText, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWebhookNotifications, type WebhookNotification } from "@/hooks/useWebhookNotifications";

const getNotificationIcon = (type: WebhookNotification['type']) => {
  switch (type) {
    case 'script':
      return <FileText className="h-4 w-4" />;
    case 'ideas':
      return <Lightbulb className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: WebhookNotification['type']) => {
  switch (type) {
    case 'script':
      return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    case 'ideas':
      return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
    default:
      return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950';
  }
};

export function WebhookNotificationContainer() {
  const { notifications, removeNotification } = useWebhookNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border rounded-lg p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${getNotificationColor(notification.type)}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getNotificationIcon(notification.type)}
              <span className="text-sm font-medium text-foreground">
                {notification.message}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-1">
            <Progress 
              value={notification.progress} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {notification.progress < 100 ? 'Processing...' : 'Complete!'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}