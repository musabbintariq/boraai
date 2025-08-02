import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <Card className="bg-card border-border text-center py-12 shadow-butter-glow">
      <CardContent>
        <Icon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <CardTitle className="font-serif mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};