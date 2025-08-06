import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  activeView: "dashboard" | "library" | "scripts";
  setActiveView: (view: "dashboard" | "library" | "scripts") => void;
}

export const DashboardLayout = ({ children, activeView, setActiveView }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1">
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};