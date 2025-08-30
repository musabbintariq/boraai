import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: 'url(/lovable-uploads/318b0b2c-863e-4aeb-a2d9-692275c0c6dd.png)' }}
      />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Minimal floating elements - hidden on mobile */}
      <div className="hidden md:block absolute top-20 left-10 opacity-40">
        <div className="bg-transparent backdrop-blur-md rounded-2xl p-3 animate-pulse">
          <TrendingUp className="w-6 h-6" style={{ color: 'hsl(45 93% 58%)' }} />
        </div>
      </div>
      <div className="hidden md:block absolute top-32 right-20 opacity-40 animation-delay-1000">
        <div className="bg-transparent backdrop-blur-md rounded-2xl p-3 animate-pulse">
          <Sparkles className="w-5 h-5" style={{ color: 'hsl(45 93% 58%)' }} />
        </div>
      </div>
      <div className="hidden md:block absolute bottom-32 left-20 opacity-40 animation-delay-2000">
        <div className="bg-transparent backdrop-blur-md rounded-2xl p-2 animate-pulse">
          <Zap className="w-4 h-4" style={{ color: 'hsl(45 93% 58%)' }} />
        </div>
      </div>

      {/* Main content with clean typography */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-20 md:pt-0">
        <div className="mb-8">
          
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-[0.9] tracking-wide font-serif">
          <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            we handle the thinking. you handle the creating.
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-white mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light px-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Bora AI handles the endless research and analysis, delivering a consistent creative direction. This frees you to focus on what you do best: Creating authentic content that connects.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft rounded-xl font-light text-base"
            onClick={() => navigate('/dashboard')}
          >
            Start Managing Content
            <Sparkles className="w-5 h-5 ml-2" style={{ color: 'hsl(45 93% 58%)' }} />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 rounded-xl font-light text-base">
            Watch Demo
          </Button>
        </div>
        
        {/* Clean stats section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-white/60 px-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">50K+</div>
            <div className="text-xs sm:text-sm font-medium">Posts Created</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">200+</div>
            <div className="text-xs sm:text-sm font-medium">Agencies & Managers</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">15+</div>
            <div className="text-xs sm:text-sm font-medium">Platforms Supported</div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;