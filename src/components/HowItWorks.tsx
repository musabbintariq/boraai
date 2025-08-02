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
  return <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 sm:mb-20 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 tracking-wide font-serif">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed text-base sm:text-lg">
            Get from zero to viral content ideas in just three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-16 sm:mb-20">
          {steps.map((step, index) => {
          const Icon = step.icon;
          return <div key={index} className="relative">
                <Card className="group hover:shadow-soft transition-all duration-300 hover:scale-[1.02] border-border/30 rounded-2xl">
                  <CardContent className="p-6 sm:p-8 lg:p-10 text-center">
                    <div className="mb-6 sm:mb-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-transparent rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-soft">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'hsl(45 93% 58%)' }} />
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-foreground font-bold text-base sm:text-lg shadow-soft border border-border/30" style={{ backgroundColor: 'hsl(45 93% 58%)', color: 'hsl(222.2 47.4% 11.2%)' }}>
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 tracking-wide font-serif">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-light text-sm sm:text-base">{step.description}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 opacity-40" style={{ color: 'hsl(45 93% 58%)' }} />
                  </div>}
              </div>;
        })}
        </div>

      </div>
    </section>;
};
export default HowItWorks;