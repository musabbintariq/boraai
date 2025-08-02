import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Bora AI branding */}
      <div className="absolute top-8 left-8 z-20">
        <button 
          onClick={() => navigate('/')}
          className="text-2xl font-serif text-foreground hover:opacity-70 transition-opacity"
        >
          Bora AI
        </button>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-gradient-to-r from-transparent via-[hsl(var(--butter-yellow))] to-transparent opacity-10 blur-3xl rounded-full" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};