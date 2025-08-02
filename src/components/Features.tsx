import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Library, Target, Zap, TrendingUp } from "lucide-react";
const Features = () => {
  const features = [{
    icon: Brain,
    title: "AI-Powered Ideas",
    description: "Personalized content ideas for your niche"
  }, {
    icon: Target,
    title: "Niche-Specific",
    description: "Tailored ideas for your audience"
  }, {
    icon: TrendingUp,
    title: "Trending Topics",
    description: "Stay ahead with trending content"
  }, {
    icon: Heart,
    title: "Save & Organize",
    description: "Build your personal content library"
  }, {
    icon: Zap,
    title: "Instant Generation",
    description: "Fresh ideas in seconds"
  }, {
    icon: Library,
    title: "Content Library",
    description: "Organize ideas in one place"
  }];
  return <section id="features" className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 sm:mb-20 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 tracking-wide font-serif">
            Everything You Need to{" "}
            <span style={{ color: 'hsl(45 93% 58%)' }}>Create Amazing Content</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed text-base sm:text-lg">
            Powerful features designed to streamline your content creation process and boost your creativity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <Card key={index} className="group hover:shadow-soft transition-all duration-300 hover:scale-[1.02] border-border/30 rounded-2xl">
                <CardContent className="p-6 sm:p-8 lg:p-10">
                  <div className="mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-transparent rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-soft">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'hsl(45 93% 58%)' }} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 tracking-wide font-serif">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-light text-sm sm:text-base">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};
export default Features;