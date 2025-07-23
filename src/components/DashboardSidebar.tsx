import { PenTool, Heart, BarChart3, LogOut } from "lucide-react";
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

interface DashboardSidebarProps {
  activeView: "analytics" | "generate" | "library";
  setActiveView: (view: "analytics" | "generate" | "library") => void;
}

export function DashboardSidebar({ activeView, setActiveView }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Analytics",
      icon: BarChart3,
      value: "analytics" as const,
    },
    {
      title: "Generate",
      icon: PenTool,
      value: "generate" as const,
    },
    {
      title: "Ideas",
      icon: Heart,
      value: "library" as const,
    },
  ];

  const handleLogout = () => {
    // TODO: Add actual logout logic when authentication is implemented
    navigate('/');
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel 
            className="text-2xl font-serif text-primary py-4 px-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveView("analytics")}
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
        
        {/* Logout Button */}
        <div className="mt-auto p-2">
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