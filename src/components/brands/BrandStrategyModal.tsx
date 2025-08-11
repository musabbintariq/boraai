import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandVoiceManager } from "./BrandVoiceManager";
import { BrandTargetAudienceManager } from "./BrandTargetAudienceManager";
import { useState } from "react";

interface BrandStrategyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string;
  brandName: string;
}

export function BrandStrategyModal({ open, onOpenChange, brandId, brandName }: BrandStrategyModalProps) {
  const [activeTab, setActiveTab] = useState("brand-voice");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold">{brandName} Strategy</DialogTitle>
          <DialogDescription>
            Define the brand voice and target audience for {brandName}. All fields are editable.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="brand-voice" className="text-base py-3">
                Brand Voice Profile
              </TabsTrigger>
              <TabsTrigger value="audience-persona" className="text-base py-3">
                Target Audience Persona
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="brand-voice" className="space-y-6">
              <BrandVoiceManager brandId={brandId} />
            </TabsContent>
            
            <TabsContent value="audience-persona" className="space-y-6">
              <BrandTargetAudienceManager brandId={brandId} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}