import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandVoiceProfile } from "./BrandVoiceProfile";
import { TargetAudienceGenerator } from "./TargetAudienceGenerator";
import { useState } from "react";

interface StrategyLabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StrategyLabModal({ open, onOpenChange }: StrategyLabModalProps) {
  const [tab, setTab] = useState("brand-voice");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold">Strategy Lab</DialogTitle>
          <DialogDescription>
            Define your brand voice and audience personas. Fields are fully editable.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="brand-voice" className="text-base py-3">
                Brand Voice Profile
              </TabsTrigger>
              <TabsTrigger value="audience-persona" className="text-base py-3">
                Target Audience Persona
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="brand-voice" forceMount className="space-y-6">
              <BrandVoiceProfile />
            </TabsContent>
            
            <TabsContent value="audience-persona" forceMount className="space-y-6">
              <TargetAudienceGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}