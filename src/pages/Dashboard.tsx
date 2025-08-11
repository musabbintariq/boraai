import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BrandProvider } from "@/contexts/BrandContext";
import { LibraryOptimized } from "@/components/library/LibraryOptimized";
import { Dashboard as DashboardComponent } from "@/components/Analytics";
import { ScriptsOptimized } from "@/components/scripts/ScriptsOptimized";
import { BrandsList } from "@/components/brands/BrandsList";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<"dashboard" | "library" | "scripts" | "brands">("dashboard");

  const renderContent = () => {
    switch(activeView) {
      case "dashboard": return <DashboardComponent />;
      case "brands": return <BrandsList />;
      case "library": return <LibraryOptimized />;
      case "scripts": return <ScriptsOptimized />;
    }
  };

  return (
    <BrandProvider>
      <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
        {renderContent()}
      </DashboardLayout>
    </BrandProvider>
  );
};

export default Dashboard;