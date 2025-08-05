import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LibraryOptimized } from "@/components/library/LibraryOptimized";
import { Analytics } from "@/components/Analytics";
import { ScriptsOptimized } from "@/components/scripts/ScriptsOptimized";
import { BrandVoiceProfile } from "@/components/strategy/BrandVoiceProfile";
import { TargetAudienceGenerator } from "@/components/strategy/TargetAudienceGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<"analytics" | "library" | "scripts" | "strategy">("analytics");

  const renderContent = () => {
    switch(activeView) {
      case "analytics": return <Analytics />;
      case "library": return <LibraryOptimized />;
      case "scripts": return <ScriptsOptimized />;
      case "strategy": return (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2">Strategy Lab</h1>
            <p className="text-muted-foreground text-lg">
              Define your brand voice and target audience to enhance all your content creation
            </p>
          </div>

          <Tabs defaultValue="brand-voice" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="brand-voice" className="text-base py-3">
                Brand Voice Profile
              </TabsTrigger>
              <TabsTrigger value="audience-persona" className="text-base py-3">
                Target Audience Persona
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="brand-voice" className="space-y-6">
              <BrandVoiceProfile />
            </TabsContent>
            
            <TabsContent value="audience-persona" className="space-y-6">
              <TargetAudienceGenerator />
            </TabsContent>
          </Tabs>
        </div>
      );
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;