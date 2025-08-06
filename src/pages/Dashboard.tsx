import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LibraryOptimized } from "@/components/library/LibraryOptimized";
import { Dashboard as DashboardComponent } from "@/components/Analytics";
import { ScriptsOptimized } from "@/components/scripts/ScriptsOptimized";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<"dashboard" | "library" | "scripts">("dashboard");

  const renderContent = () => {
    switch(activeView) {
      case "dashboard": return <DashboardComponent />;
      case "library": return <LibraryOptimized />;
      case "scripts": return <ScriptsOptimized />;
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;