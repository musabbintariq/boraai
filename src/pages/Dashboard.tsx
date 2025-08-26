import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BrandProvider, useBrandContext } from "@/contexts/BrandContext";
import { LibraryOptimized } from "@/components/library/LibraryOptimized";
import { Dashboard as DashboardComponent } from "@/components/Analytics";
import { ScriptsOptimized } from "@/components/scripts/ScriptsOptimized";
import { BrandsList } from "@/components/brands/BrandsList";
import { Library } from "@/components/Library";
import { Scripts } from "@/components/Scripts";

const DashboardContent = () => {
  const [activeView, setActiveView] = useState<"dashboard" | "library" | "scripts" | "brands">("dashboard");
  const { activeBrandId } = useBrandContext();

  const renderContent = () => {
    switch(activeView) {
      case "dashboard": return <DashboardComponent setActiveView={setActiveView} />;
      case "brands": return <BrandsList />;
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

const Dashboard = () => {
  return (
    <BrandProvider>
      <DashboardContent />
    </BrandProvider>
  );
};

export default Dashboard;