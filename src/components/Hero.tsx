import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import heroImage from "@/assets/hero-content-ideas.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Clean gradient background inspired by Lovable */}
      <div className="absolute inset-0 bg-gradient-lovable" />
      
      {/* Minimal floating elements */}
      <div className="absolute top-20 left-10 opacity-40">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 animate-pulse">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute top-32 right-20 opacity-40 animation-delay-1000">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 animate-pulse">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 opacity-40 animation-delay-2000">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 animate-pulse">
          <Zap className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Main content with clean typography */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-medium border border-white/20">
            <Sparkles className="w-4 h-4" />
            AI-Powered Content Ideas
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.9] tracking-tight">
          Never Run Out of{" "}
          <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            Content Ideas
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Get trending, personalized content ideas for your brand instantly. 
          AI-powered suggestions tailored to your niche and audience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-10 py-4 bg-white text-primary hover:bg-white/90 shadow-soft font-semibold rounded-xl"
          >
            Start Creating Ideas
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-10 py-4 bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 rounded-xl font-medium"
          >
            Watch Demo
          </Button>
        </div>
        
        {/* Clean stats section */}
        <div className="flex items-center justify-center gap-12 text-white/60">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-sm font-medium">Ideas Generated</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-sm font-medium">Happy Creators</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm font-medium">AI Assistant</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;