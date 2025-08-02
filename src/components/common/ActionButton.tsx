import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const ActionButton = ({ 
  onClick, 
  icon: Icon, 
  children, 
  variant = "outline", 
  size = "sm",
  className = ""
}: ActionButtonProps) => {
  return (
    <Button variant={variant} size={size} onClick={onClick} className={className}>
      <Icon className="h-4 w-4 mr-1" />
      {children}
    </Button>
  );
};