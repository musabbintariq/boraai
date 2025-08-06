import { Lightbulb, BarChart3, LogOut, FileText, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarUserProfile } from "./dashboard/SidebarUserProfile";

interface DashboardSidebarProps {
  activeView: "dashboard" | "library" | "scripts";
  setActiveView: (view: "dashboard" | "library" | "scripts") => void;
}

export function DashboardSidebar({ activeView, setActiveView }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      value: "dashboard" as const,
    },
    {
      title: "Ideas",
      icon: Lightbulb,
      value: "library" as const,
    },
    {
      title: "Scripts",
      icon: FileText,
      value: "scripts" as const,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel 
            className="text-3xl font-serif text-primary py-6 px-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveView("dashboard")}
          >
            {!collapsed && "Bora AI"}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-8">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeView === item.value}
                    onClick={() => setActiveView(item.value)}
                    className="w-full justify-start py-3"
                  >
                    <item.icon className="h-4 w-4" style={{ color: 'hsl(var(--butter-yellow))' }} />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* User Profile Section */}
        <div className="mt-auto p-2">
          <SidebarUserProfile />
        </div>
        
        {/* Logout Button */}
        <div className="p-2">
          <SidebarMenuButton
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}