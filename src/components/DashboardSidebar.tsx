import { PenTool, Heart } from "lucide-react";
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
  activeView: "generate" | "library";
  setActiveView: (view: "generate" | "library") => void;
}

export function DashboardSidebar({ activeView, setActiveView }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const menuItems = [
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
          <SidebarGroupLabel className="text-lg font-serif text-primary">
            {!collapsed && "Bora AI"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeView === item.value}
                    onClick={() => setActiveView(item.value)}
                    className="w-full justify-start"
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