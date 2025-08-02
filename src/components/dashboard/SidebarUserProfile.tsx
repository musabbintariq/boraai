import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/ui/sidebar";

const planConfig = {
  free: { 
    icon: Zap, 
    color: "text-slate-500", 
    bgColor: "bg-slate-100 dark:bg-slate-800",
    label: "Free" 
  },
  pro: { 
    icon: Star, 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    label: "Pro" 
  },
  enterprise: { 
    icon: Crown, 
    color: "text-purple-600", 
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    label: "Enterprise" 
  }
};

export const SidebarUserProfile = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (!user || !profile) {
    return null;
  }

  const displayName = profile.full_name || profile.display_name || user.email?.split('@')[0] || 'User';
  const planName = profile.plan || 'free';
  const currentPlan = planConfig[planName as keyof typeof planConfig] || planConfig.free;
  const PlanIcon = currentPlan.icon;

  const handleUpgrade = () => {
    setUpgradeOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-full h-auto p-3 flex flex-col items-start gap-1 hover:bg-muted/50"
        onClick={handleUpgrade}
      >
        <div className="flex items-center gap-2 w-full">
          <div className={`p-1 rounded-full ${currentPlan.bgColor}`}>
            <PlanIcon className={`h-3 w-3 ${currentPlan.color}`} />
          </div>
          {!collapsed && (
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-sm font-medium truncate w-full text-left">
                {displayName}
              </span>
              <Badge 
                variant="secondary" 
                className={`text-xs px-2 py-0 ${currentPlan.bgColor} ${currentPlan.color} border-0`}
              >
                {currentPlan.label}
              </Badge>
            </div>
          )}
        </div>
      </Button>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Upgrade Your Plan
            </DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your content creation needs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-3">
              {/* Free Plan */}
              <div className={`p-4 rounded-lg border ${planName === 'free' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-slate-500" />
                    <span className="font-medium">Free</span>
                  </div>
                  {planName === 'free' && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Basic features to get started
                </p>
              </div>

              {/* Pro Plan */}
              <div className={`p-4 rounded-lg border ${planName === 'pro' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 cursor-pointer'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Pro</span>
                    <span className="text-sm font-semibold">$9.99/mo</span>
                  </div>
                  {planName === 'pro' ? (
                    <Badge variant="secondary">Current</Badge>
                  ) : (
                    <Button size="sm">Upgrade</Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Advanced AI features and unlimited ideas
                </p>
              </div>

              {/* Enterprise Plan */}
              <div className={`p-4 rounded-lg border ${planName === 'enterprise' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 cursor-pointer'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Enterprise</span>
                    <span className="text-sm font-semibold">$29.99/mo</span>
                  </div>
                  {planName === 'enterprise' ? (
                    <Badge variant="secondary">Current</Badge>
                  ) : (
                    <Button size="sm">Upgrade</Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Priority support and team collaboration
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};