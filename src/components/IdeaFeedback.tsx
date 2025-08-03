import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Clock } from "lucide-react";
import { useGeneratedIdeas, GeneratedIdea } from "@/hooks/useGeneratedIdeas";

interface IdeaFeedbackProps {
  onComplete?: () => void;
}

export const IdeaFeedback = ({ onComplete }: IdeaFeedbackProps) => {
  const { pendingIdeas, likeIdea, dislikeIdea, getNextPendingIdea } = useGeneratedIdeas();
  const [currentIdea, setCurrentIdea] = useState<GeneratedIdea | null>(getNextPendingIdea());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async () => {
    if (!currentIdea || isProcessing) return;
    
    setIsProcessing(true);
    const success = await likeIdea(currentIdea);
    
    if (success) {
      const nextIdea = getNextPendingIdea();
      setCurrentIdea(nextIdea);
      
      if (!nextIdea) {
        onComplete?.();
      }
    }
    setIsProcessing(false);
  };

  const handleDislike = async () => {
    if (!currentIdea || isProcessing) return;
    
    setIsProcessing(true);
    const success = await dislikeIdea(currentIdea.id);
    
    if (success) {
      const nextIdea = getNextPendingIdea();
      setCurrentIdea(nextIdea);
      
      if (!nextIdea) {
        onComplete?.();
      }
    }
    setIsProcessing(false);
  };

  const handleSkip = () => {
    if (!currentIdea) return;
    
    const nextIdea = getNextPendingIdea();
    setCurrentIdea(nextIdea);
    
    if (!nextIdea) {
      onComplete?.();
    }
  };

  if (!currentIdea) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No ideas to review</h3>
            <p className="text-muted-foreground">
              Generate some new content ideas to start reviewing them here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const remainingCount = pendingIdeas.length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {remainingCount > 1 && (
        <div className="text-center">
          <Badge variant="outline" className="text-sm">
            {remainingCount} ideas remaining
          </Badge>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{currentIdea.title}</CardTitle>
            <Badge variant="secondary">{currentIdea.platform}</Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {currentIdea.content}
            </p>
            
            {currentIdea.tags && currentIdea.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentIdea.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleDislike}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Pass
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleSkip}
            disabled={isProcessing}
          >
            Skip for now
          </Button>
          
          <Button
            size="lg"
            onClick={handleLike}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Save to Library
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};