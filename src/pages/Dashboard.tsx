import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Generate } from "@/components/Generate";
import { Library } from "@/components/Library";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<"generate" | "library">("generate");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-8">
          {activeView === "generate" && <Generate />}
          {activeView === "library" && <Library />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;