import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-32 bg-gradient-lovable relative overflow-hidden">
      {/* Minimal background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-3xl rotate-12" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-2xl rotate-45" />
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-white rounded-2xl rotate-6" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-medium border border-white/20">
            <Sparkles className="w-4 h-4" />
            Ready to Get Started?
          </span>
        </div>
        
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-[0.9] tracking-tight">
          Transform Your Content{" "}
          <span className="block">Strategy Today</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Join thousands of content creators who never run out of fresh, engaging ideas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-12 py-5 bg-white text-primary hover:bg-white/90 shadow-soft font-semibold rounded-xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-12 py-5 bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 rounded-xl font-medium"
          >
            Learn More
          </Button>
        </div>
        
        <p className="text-white/50 text-sm font-medium">
          No credit card required • Setup in 2 minutes • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTA;