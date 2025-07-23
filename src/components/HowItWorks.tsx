import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Sparkles, Heart } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: User,
      title: "Tell Us About Your Brand",
      description: "Share your niche, target audience, and any competitor pages for inspiration.",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Sparkles,
      title: "Get AI-Generated Ideas",
      description: "Our AI analyzes trends and generates personalized content ideas just for you.",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: Heart,
      title: "Save & Organize",
      description: "Like your favorite ideas and build your personal content library for future use.",
      color: "from-pink-600 to-red-500"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get from zero to viral content ideas in just three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="group hover:shadow-primary transition-all duration-300 hover:scale-105 border-border/50">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="gradient" size="lg" className="text-lg px-8 py-4">
            Start Creating Content Ideas
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;