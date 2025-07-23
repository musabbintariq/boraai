import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import heroImage from "@/assets/hero-content-ideas.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 opacity-60">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 animate-bounce">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute top-32 right-20 opacity-60 animation-delay-1000">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 animate-bounce">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 opacity-60 animation-delay-2000">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 animate-bounce">
          <Zap className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Content Ideas
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Never Run Out of
          <span className="block bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Content Ideas
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Get trending, personalized content ideas for your brand instantly. 
          AI-powered suggestions tailored to your niche and audience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4">
            Start Creating Ideas
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            Watch Demo
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-8 text-white/70">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-sm">Ideas Generated</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-sm">Happy Creators</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-sm">AI Assistant</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;