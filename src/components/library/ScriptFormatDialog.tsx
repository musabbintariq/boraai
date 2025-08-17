import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface ScriptFormatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (formatData: ScriptFormatData) => void;
}

export interface ScriptFormatData {
  format: 'reel' | 'carousel';
  duration?: number; // for reels (in seconds)
  carouselLength?: number; // for carousels (number of slides)
}

export function ScriptFormatDialog({ isOpen, onOpenChange, onConfirm }: ScriptFormatDialogProps) {
  const [format, setFormat] = useState<'reel' | 'carousel'>('reel');
  const [duration, setDuration] = useState([30]);
  const [carouselLength, setCarouselLength] = useState(5);

  const handleConfirm = () => {
    const formatData: ScriptFormatData = {
      format,
      ...(format === 'reel' ? { duration: duration[0] } : { carouselLength })
    };
    onConfirm(formatData);
    onOpenChange(false);
    // Reset form
    setFormat('reel');
    setDuration([30]);
    setCarouselLength(5);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Script Format</DialogTitle>
          <DialogDescription>
            Select the format and specify the details for your script generation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Format Type</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as 'reel' | 'carousel')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reel" id="reel" />
                <Label htmlFor="reel">Reel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="carousel" id="carousel" />
                <Label htmlFor="carousel">Carousel</Label>
              </div>
            </RadioGroup>
          </div>

          {format === 'reel' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Duration: {duration[0]} seconds
              </Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={180}
                min={15}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>15s</span>
                <span>180s</span>
              </div>
            </div>
          )}

          {format === 'carousel' && (
            <div className="space-y-3">
              <Label htmlFor="carousel-length" className="text-sm font-medium">
                Number of Slides
              </Label>
              <Input
                id="carousel-length"
                type="number"
                min="2"
                max="20"
                value={carouselLength}
                onChange={(e) => setCarouselLength(parseInt(e.target.value) || 5)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Between 2 and 20 slides
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Generate Script
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}