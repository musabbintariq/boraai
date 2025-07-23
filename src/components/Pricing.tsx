import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Get started with basic content ideas",
      features: [
        "5 content ideas per month",
        "Basic templates",
        "Email support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Solo Creator",
      price: "$20",
      period: "per month",
      description: "Perfect for individual content creators",
      features: [
        "Unlimited content ideas",
        "Premium templates",
        "Priority support",
        "Analytics dashboard",
        "Export to various formats"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For teams and large organizations",
      features: [
        "Everything in Solo Creator",
        "Team collaboration",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced analytics",
        "Custom branding"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 sm:mb-20 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 tracking-wide font-serif">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed text-base sm:text-lg">
            Select the perfect plan for your content creation needs
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative group hover:shadow-soft transition-all duration-300 hover:scale-[1.02] border-border/30 rounded-2xl ${
                plan.popular ? 'border-2 border-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 text-black" style={{ backgroundColor: 'hsl(45 93% 58%)' }}>
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center p-6 sm:p-8">
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground mb-2 font-serif">
                  {plan.name}
                </CardTitle>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2 text-sm sm:text-base">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground font-light text-sm sm:text-base">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 pt-0">
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-light text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.buttonVariant}
                  className="w-full py-3 rounded-xl font-medium"
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;