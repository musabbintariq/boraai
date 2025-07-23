import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Generate } from "@/components/Generate";
import { Library } from "@/components/Library";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<"generate" | "library">("generate");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1">
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="ml-4" />
          </header>
          <div className="p-8">
            {activeView === "generate" && <Generate />}
            {activeView === "library" && <Library />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;