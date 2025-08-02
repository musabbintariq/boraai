import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "./ActionButton";
import { Copy, Edit, Trash2, LucideIcon } from "lucide-react";

interface ItemCardProps {
  item: {
    id: number;
    title: string;
    content: string;
    platform: string;
    createdAt: string;
    tags: string[];
  };
  onCopy: (content: string) => void;
  onEdit: (item: any) => void;
  onRemove: (id: number) => void;
  primaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick: (item: any) => void;
  };
  additionalActions?: Array<{
    label: string;
    icon: LucideIcon;
    onClick: (item: any) => void;
  }>;
}

export const ItemCard = ({ item, onCopy, onEdit, onRemove, primaryAction, additionalActions = [] }: ItemCardProps) => {
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
            {item.content}
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
            <ActionButton onClick={() => onCopy(item.content)} icon={Copy}>
              Copy
            </ActionButton>
            {additionalActions.map((action, index) => (
              <ActionButton 
                key={index}
                onClick={() => action.onClick(item)} 
                icon={action.icon}
              >
                {action.label}
              </ActionButton>
            ))}
            <ActionButton onClick={() => onEdit(item)} icon={Edit}>
              Edit
            </ActionButton>
            {primaryAction && (
              <ActionButton
                onClick={() => primaryAction.onClick(item)}
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