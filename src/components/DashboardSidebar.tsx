import { PenTool, Heart, BarChart3 } from "lucide-react";
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

interface DashboardSidebarProps {
  activeView: "analytics" | "generate" | "library";
  setActiveView: (view: "analytics" | "generate" | "library") => void;
}

export function DashboardSidebar({ activeView, setActiveView }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
      title: "Library",
      icon: Heart,
      value: "library" as const,
    },
  ];

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
      </SidebarContent>
    </Sidebar>
  );
}