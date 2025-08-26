import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Heart, Eye, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { StatCard } from "@/components/common/StatCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBrands } from "@/hooks/useBrands";
import { useBrandContext } from "@/contexts/BrandContext";
import { useState } from "react";

// Mock data for demonstration
const followersData = [{
  month: "Jan",
  followers: 1200
}, {
  month: "Feb",
  followers: 1350
}, {
  month: "Mar",
  followers: 1500
}, {
  month: "Apr",
  followers: 1680
}, {
  month: "May",
  followers: 1850
}, {
  month: "Jun",
  followers: 2100
}];
const engagementData = [{
  month: "Jan",
  likes: 450,
  comments: 120,
  views: 2800
}, {
  month: "Feb",
  likes: 520,
  comments: 150,
  views: 3200
}, {
  month: "Mar",
  likes: 610,
  comments: 180,
  views: 3800
}, {
  month: "Apr",
  likes: 580,
  comments: 165,
  views: 4100
}, {
  month: "May",
  likes: 720,
  comments: 220,
  views: 4600
}, {
  month: "Jun",
  likes: 850,
  comments: 280,
  views: 5200
}];
export function Dashboard() {
  const {
    profile
  } = useUserProfile();
  const {
    brands
  } = useBrands();
  const {
    activeBrandId,
    setActiveBrandId
  } = useBrandContext();
  const statsData = [{
    title: "Total Followers",
    value: "2,100",
    trend: "+42.5% from last month",
    icon: Users
  }, {
    title: "Avg. Engagement",
    value: "7.2%",
    trend: "+18.3% from last month",
    icon: Heart
  }, {
    title: "Total Likes",
    value: "3,750",
    trend: "+24.1% from last month",
    icon: Heart
  }, {
    title: "Total Views",
    value: "23.8K",
    trend: "+12.5% from last month",
    icon: Eye
  }];
  const firstName = profile?.display_name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || 'there';
  return <div className="max-w-6xl mx-auto">
      {/* Greeting Section */}
      <div className="mb-8">
        <div className="rounded-lg p-[1px] bg-gradient-lovable shadow-glow">
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-serif font-bold mb-2">Hi {firstName}! 👋</h1>
                  <p className="text-muted-foreground">
                    Welcome to your content creation dashboard.
                  </p>
                </div>
                {brands.length > 0 && <Select value={activeBrandId || ""} onValueChange={setActiveBrandId}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => <SelectItem key={brand.brand_id} value={brand.brand_id}>
                          {brand.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Section */}
      

      {/* Overview Stats */}
      

      {/* Charts */}
      
    </div>;
}