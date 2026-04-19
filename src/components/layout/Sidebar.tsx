import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  List,
  Users,
  PiggyBank,
  HandCoins,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", labelKey: "nav.dashboard", icon: LayoutDashboard },
    { path: "/add-expense", labelKey: "nav.addExpense", icon: Plus },
    { path: "/expenses", labelKey: "nav.expenses", icon: List },
    { path: "/groups", labelKey: "nav.groups", icon: Users },
    { path: "/budget", labelKey: "nav.budget", icon: PiggyBank },
    { path: "/loans", labelKey: "nav.loans", icon: HandCoins },
    { path: "/settings", labelKey: "nav.settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Wallet className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-lg text-sidebar-foreground">{t("nav.appName")}</h1>
            <p className="text-xs text-sidebar-foreground/60">{t("nav.appTagline")}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const label = t(item.labelKey);

          const linkContent = (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium animate-fade-in">{label}</span>}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span>{t("nav.collapse")}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
