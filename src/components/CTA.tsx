import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
const CTA = () => {
  return <section className="py-32 relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: 'url(/lovable-uploads/b8dddceb-7c6b-452e-a61c-0ec638702d67.png)' }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
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
            <Sparkles className="w-4 h-4" style={{ color: 'hsl(45 93% 58%)' }} />
            Ready to Get Started?
          </span>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-8 leading-[0.9] tracking-tight md:text-4xl">
          Transform Your Content{" "}
          <span className="block">Strategy Today</span>
        </h2>
        
        <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light md:text-lg">
          Join thousands of content creators who never run out of fresh, engaging ideas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <Button variant="hero" size="lg" className="px-12 py-5 bg-white text-primary hover:bg-white/90 shadow-soft rounded-xl text-base font-light">
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" style={{ color: 'hsl(45 93% 58%)' }} />
          </Button>
          <Button variant="outline" size="lg" className="px-12 py-5 bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 rounded-xl text-base font-light">
            Learn More
          </Button>
        </div>
        
        <p className="text-white/50 text-sm font-medium">
          No credit card required • Setup in 2 minutes • Cancel anytime
        </p>
      </div>
    </section>;
};
export default CTA;