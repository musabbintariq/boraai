import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandVoiceProfile } from "@/components/strategy/BrandVoiceProfile";
import { TargetAudienceGenerator } from "@/components/strategy/TargetAudienceGenerator";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function StrategyLab() {
  return (
    <DashboardLayout activeView="strategy">
      <div className="max-w-6xl mx-auto p-6">
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
    </DashboardLayout>
  );
}