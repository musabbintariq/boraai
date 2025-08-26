import { useState } from "react";
import { Building2, Lightbulb, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { GenerateIdeasDialog } from "@/components/library/GenerateIdeasDialog";

interface DashboardActionsProps {
  setActiveView: (view: "dashboard" | "library" | "scripts" | "brands") => void;
}

export const DashboardActions = ({ setActiveView }: DashboardActionsProps) => {
  const { user } = useAuth();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const actions = [
    {
      id: "brands",
      title: "Manage Brands",
      description: "Create and manage your brand profiles",
      icon: Building2,
      color: "from-blue-500 to-purple-600",
      glowColor: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
      onClick: () => setActiveView("brands")
    },
    {
      id: "ideas",
      title: "Generate Ideas",
      description: "AI-powered content ideas for your brands",
      icon: Lightbulb,
      color: "from-yellow-400 to-orange-500",
      glowColor: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
      onClick: () => setIsGenerateDialogOpen(true)
    },
    {
      id: "scripts",
      title: "Generate Scripts",
      description: "Convert ideas into engaging scripts",
      icon: FileText,
      color: "from-green-400 to-emerald-600",
      glowColor: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
      onClick: () => setActiveView("scripts")
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Welcome back, {user?.email?.split('@')[0] || 'Creator'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose an action below to start creating amazing content for your brands
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              onClick={action.onClick}
              variant="ghost"
              className={`
                group relative h-auto p-8 bg-gradient-to-br ${action.color} 
                text-white border-0 overflow-hidden
                hover:scale-105 hover:${action.glowColor}
                transition-all duration-300 ease-out
                animate-fade-in
              `}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10 space-y-4 text-center">
                <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{action.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          );
        })}
      </div>

      <GenerateIdeasDialog
        isOpen={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      />
    </div>
  );
};