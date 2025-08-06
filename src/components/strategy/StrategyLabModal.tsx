import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandVoiceProfile } from "./BrandVoiceProfile";
import { TargetAudienceGenerator } from "./TargetAudienceGenerator";

interface StrategyLabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StrategyLabModal({ open, onOpenChange }: StrategyLabModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold">Strategy Lab</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <Tabs defaultValue="brand-voice" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
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
      </DialogContent>
    </Dialog>
  );
}