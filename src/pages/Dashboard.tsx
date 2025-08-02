import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Library } from "@/components/Library";
import { Analytics } from "@/components/Analytics";
import { Scripts } from "@/components/Scripts";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<"analytics" | "library" | "scripts">("analytics");
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1">
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="ml-4" />
          </header>
          <div className="p-8">
            {activeView === "analytics" && <Analytics />}
            {activeView === "library" && <Library />}
            {activeView === "scripts" && <Scripts />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;