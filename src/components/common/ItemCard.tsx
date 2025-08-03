import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "./ActionButton";
import { Copy, Edit, Trash2, LucideIcon } from "lucide-react";

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    platform: string;
    createdAt: string;
    tags: string[];
    [key: string]: any;
  };
  contentKey?: string;
  extraData?: Record<string, any>;
  onCopy: (content: string) => void;
  onEdit: (item: any) => void;
  onRemove: (id: string) => void;
  primaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick: (item: any) => void;
  };
  secondaryActions?: Array<{
    label: string;
    icon: LucideIcon;
    onClick: (item: any) => void;
  }>;
  additionalActions?: Array<{
    label: string;
    icon: LucideIcon;
    onClick: (item: any) => void;
  }>;
}

export const ItemCard = ({ 
  item, 
  contentKey = "content", 
  extraData = {}, 
  onCopy, 
  onEdit, 
  onRemove, 
  primaryAction, 
  secondaryActions = [],
  additionalActions = [] 
}: ItemCardProps) => {
  const content = extraData.content || item[contentKey] || item.content || "";
  const combinedItem = { ...item, ...extraData };
  return (
    <Card className="bg-card border-border shadow-butter-glow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-sans font-bold text-xl mb-2">{item.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{item.platform}</Badge>
              <span className="text-sm text-muted-foreground">{item.createdAt}</span>
            </div>
          </div>
          <ActionButton
            onClick={() => onRemove(item.id)}
            icon={Trash2}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
          >
            <span className="sr-only">Remove</span>
          </ActionButton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <p className="text-sm leading-relaxed line-clamp-2 break-words overflow-hidden">
            {content}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {item.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <ActionButton onClick={() => onCopy(content)} icon={Copy}>
              Copy
            </ActionButton>
            {secondaryActions.map((action, index) => (
              <ActionButton 
                key={`secondary-${index}`}
                onClick={() => action.onClick(combinedItem)} 
                icon={action.icon}
              >
                {action.label}
              </ActionButton>
            ))}
            {additionalActions.map((action, index) => (
              <ActionButton 
                key={`additional-${index}`}
                onClick={() => action.onClick(combinedItem)} 
                icon={action.icon}
              >
                {action.label}
              </ActionButton>
            ))}
            <ActionButton onClick={() => onEdit(combinedItem)} icon={Edit}>
              Edit
            </ActionButton>
            {primaryAction && (
              <ActionButton
                onClick={() => primaryAction.onClick(combinedItem)}
                icon={primaryAction.icon}
                className="bg-[hsl(var(--butter-yellow))] text-black hover:bg-[hsl(var(--butter-yellow))]/90"
              >
                {primaryAction.label}
              </ActionButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};