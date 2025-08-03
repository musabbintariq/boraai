import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LibraryOptimized } from "@/components/library/LibraryOptimized";
import { Analytics } from "@/components/Analytics";
import { ScriptsOptimized } from "@/components/scripts/ScriptsOptimized";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<"analytics" | "library" | "scripts">("analytics");

  const renderContent = () => {
    switch(activeView) {
      case "analytics": return <Analytics />;
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