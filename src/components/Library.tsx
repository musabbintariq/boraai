import { useState } from "react";
import { Heart, Copy, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for liked ideas
const mockLikedIdeas = [
  {
    id: 1,
    title: "Summer Fashion Trends",
    content: "Discover the hottest summer fashion trends that will make you stand out. From vibrant colors to sustainable fabrics...",
    platform: "Instagram",
    createdAt: "2024-01-15",
    tags: ["fashion", "summer", "trends"]
  },
  {
    id: 2,
    title: "Professional LinkedIn Post",
    content: "How to write compelling LinkedIn posts that engage your professional network and drive meaningful conversations...",
    platform: "LinkedIn",
    createdAt: "2024-01-14",
    tags: ["professional", "networking", "content"]
  },
  {
    id: 3,
    title: "Brand Storytelling Ideas",
    content: "Transform your brand narrative with these powerful storytelling techniques that resonate with your audience...",
    platform: "Instagram",
    createdAt: "2024-01-13",
    tags: ["storytelling", "branding", "engagement"]
  }
];

export function Library() {
  const [likedIdeas] = useState(mockLikedIdeas);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // TODO: Add toast notification
  };

  const handleShare = (idea: any) => {
    // TODO: Implement share functionality
    console.log("Sharing idea:", idea.title);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-italiana mb-4">Content Library</h1>
        <p className="text-muted-foreground">
          Your collection of liked content ideas, ready to use whenever you need inspiration.
        </p>
      </div>

      {likedIdeas.length === 0 ? (
        <Card className="bg-card border-border text-center py-12">
          <CardContent>
            <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <CardTitle className="font-italiana mb-2">No Liked Ideas Yet</CardTitle>
            <CardDescription>
              Start generating content and like your favorite ideas to see them here.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {likedIdeas.map((idea) => (
            <Card key={idea.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-italiana text-xl mb-2">{idea.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{idea.platform}</Badge>
                      <span className="text-sm text-muted-foreground">{idea.createdAt}</span>
                    </div>
                  </div>
                  <Heart className="h-5 w-5 fill-current" style={{ color: 'hsl(var(--butter-yellow))' }} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{idea.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {idea.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(idea.content)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(idea)}
                    >
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}