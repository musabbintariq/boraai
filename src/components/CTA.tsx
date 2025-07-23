import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full" />
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/20 rounded-lg rotate-45" />
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-lg rotate-12" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Ready to Get Started?
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Transform Your Content
          <span className="block">Strategy Today</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of content creators who never run out of fresh, engaging ideas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="lg" className="text-lg px-10 py-5 bg-white text-primary hover:bg-white/90">
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-10 py-5 bg-transparent border-white/30 text-white hover:bg-white/10">
            Learn More
          </Button>
        </div>
        
        <p className="text-white/70 text-sm mt-6">
          No credit card required • Setup in 2 minutes • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTA;