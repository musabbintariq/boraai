import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Library } from "@/components/Library";
import { Analytics } from "@/components/Analytics";
import { Scripts } from "@/components/Scripts";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<"analytics" | "library" | "scripts">("analytics");

  const renderContent = () => {
    switch(activeView) {
      case "analytics": return <Analytics />;
      case "library": return <Library />;
      case "scripts": return <Scripts />;
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;