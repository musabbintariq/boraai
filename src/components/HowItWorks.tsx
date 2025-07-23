import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Sparkles, Heart } from "lucide-react";
const HowItWorks = () => {
  const steps = [{
    icon: User,
    title: "Tell Us About Your Brand",
    description: "Share your niche, target audience, and any competitor pages for inspiration.",
    color: "from-blue-500 to-purple-600"
  }, {
    icon: Sparkles,
    title: "Get AI-Generated Ideas",
    description: "Our AI analyzes trends and generates personalized content ideas just for you.",
    color: "from-purple-600 to-pink-600"
  }, {
    icon: Heart,
    title: "Save & Organize",
    description: "Like your favorite ideas and build your personal content library for future use.",
    color: "from-pink-600 to-red-500"
  }];
  return <section className="py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-foreground mb-6 tracking-tight md:text-4xl">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed text-lg">
            Get from zero to viral content ideas in just three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {steps.map((step, index) => {
          const Icon = step.icon;
          return <div key={index} className="relative">
                <Card className="group hover:shadow-soft transition-all duration-300 hover:scale-[1.02] border-border/30 rounded-2xl">
                  <CardContent className="p-10 text-center">
                    <div className="mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg shadow-soft">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-light">{step.description}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-primary opacity-40" />
                  </div>}
              </div>;
        })}
        </div>

        <div className="text-center">
          <Button variant="gradient" size="lg" className="px-12 py-5 shadow-soft rounded-xl font-light text-base">
            Start Creating Content Ideas
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>;
};
export default HowItWorks;