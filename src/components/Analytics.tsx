import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Heart, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock data for demonstration
const followersData = [
  { month: "Jan", followers: 1200 },
  { month: "Feb", followers: 1350 },
  { month: "Mar", followers: 1500 },
  { month: "Apr", followers: 1680 },
  { month: "May", followers: 1850 },
  { month: "Jun", followers: 2100 },
];

const engagementData = [
  { month: "Jan", likes: 450, comments: 120, views: 2800 },
  { month: "Feb", likes: 520, comments: 150, views: 3200 },
  { month: "Mar", likes: 610, comments: 180, views: 3800 },
  { month: "Apr", likes: 580, comments: 165, views: 4100 },
  { month: "May", likes: 720, comments: 220, views: 4600 },
  { month: "Jun", likes: 850, comments: 280, views: 5200 },
];

export function Analytics() {
  const followersIncrease = 42.5; // percentage
  const engagementIncrease = 18.3; // percentage

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-4">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your social media performance and growth metrics.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border shadow-butter-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-sans font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,100</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" style={{ color: 'hsl(var(--butter-yellow))' }} />
              +{followersIncrease}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-butter-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-sans font-medium">Avg. Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" style={{ color: 'hsl(var(--butter-yellow))' }} />
              +{engagementIncrease}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-butter-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-sans font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,750</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" style={{ color: 'hsl(var(--butter-yellow))' }} />
              +24.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-butter-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-sans font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.8K</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" style={{ color: 'hsl(var(--butter-yellow))' }} />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-butter-glow">
          <CardHeader>
            <CardTitle className="font-sans font-bold">Followers Growth</CardTitle>
            <CardDescription>Monthly followers growth over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={followersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="followers" 
                  stroke="hsl(var(--butter-yellow))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--butter-yellow))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-butter-glow">
          <CardHeader>
            <CardTitle className="font-sans font-bold">Engagement Metrics</CardTitle>
            <CardDescription>Likes, comments, and views over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="likes" fill="hsl(var(--butter-yellow))" />
                <Bar dataKey="comments" fill="hsl(var(--primary))" />
                <Bar dataKey="views" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}