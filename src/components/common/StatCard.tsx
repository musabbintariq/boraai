import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}

export const StatCard = ({ title, value, trend, icon: Icon }: StatCardProps) => {
  return (
    <Card className="bg-card border-border shadow-butter-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-sans font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3 mr-1" style={{ color: 'hsl(var(--butter-yellow))' }} />
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};