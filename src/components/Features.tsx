import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Library, Target, Zap, TrendingUp } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Ideas",
      description: "Advanced AI analyzes your niche and generates personalized content ideas that resonate with your audience."
    },
    {
      icon: Target,
      title: "Niche-Specific",
      description: "Get ideas tailored to your specific industry, audience, and brand voice for maximum engagement."
    },
    {
      icon: TrendingUp,
      title: "Trending Topics",
      description: "Stay ahead with content ideas based on current trends and what's performing well in your space."
    },
    {
      icon: Heart,
      title: "Save & Organize",
      description: "Like your favorite ideas and build a personal library of content concepts you can return to anytime."
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Get fresh content ideas in seconds, not hours. Perfect for busy content creators and marketers."
    },
    {
      icon: Library,
      title: "Content Library",
      description: "Edit, organize, and manage all your saved ideas in one place. Never lose a great concept again."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Create Amazing Content</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to streamline your content creation process and boost your creativity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-primary transition-all duration-300 hover:scale-105 border-border/50">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;