
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Calendar,
  Inbox,
  Mail,
  Settings,
  Users,
  PieChart,
  List,
  Activity,
} from "lucide-react";

type SideNavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: boolean;
  submenuItems?: SideNavItem[];
};

const sidebarNavItems: SideNavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart,
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: Mail,
  },
  {
    title: "Subscribers",
    href: "/subscribers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: PieChart,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: List,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Automations",
    href: "/automations",
    icon: Activity,
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: Inbox,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="hidden border-r bg-sidebar md:block md:w-64 lg:w-72">
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Mail className="h-6 w-6 text-brand-500" />
          <span className="text-xl font-bold text-gradient">EngageAI</span>
        </Link>
      </div>
      <div className="py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {sidebarNavItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === item.href
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
