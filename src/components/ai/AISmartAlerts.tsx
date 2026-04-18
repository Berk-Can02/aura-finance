import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X, AlertTriangle, TrendingUp, Calendar, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { AIBadge } from "./AIBadge";

interface SmartAlert {
  id: string;
  type: "warning" | "insight" | "reminder" | "achievement";
  titleKey: string;
  messageKey: string;
  timeKey: string;
  timeCount?: number;
  priority: "high" | "medium" | "low";
}

const mockAlerts: SmartAlert[] = [
  { id: "1", type: "warning", titleKey: "ai.alerts.budgetTitle", messageKey: "ai.alerts.budgetMsg", timeKey: "ai.alerts.hoursAgo", timeCount: 2, priority: "high" },
  { id: "2", type: "insight", titleKey: "ai.alerts.patternTitle", messageKey: "ai.alerts.patternMsg", timeKey: "ai.alerts.hoursAgo", timeCount: 5, priority: "medium" },
  { id: "3", type: "reminder", titleKey: "ai.alerts.billTitle", messageKey: "ai.alerts.billMsg", timeKey: "ai.alerts.dayAgo", priority: "high" },
  { id: "4", type: "achievement", titleKey: "ai.alerts.savingsTitle", messageKey: "ai.alerts.savingsMsg", timeKey: "ai.alerts.daysAgo", timeCount: 2, priority: "low" },
];

const alertConfig = {
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  insight: { icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  reminder: { icon: Calendar, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/30" },
  achievement: { icon: Sparkles, color: "text-success", bg: "bg-success/10", border: "border-success/30" },
};

const priorityStyles = { high: "ring-2 ring-warning/30", medium: "", low: "opacity-80" };

export function AISmartAlerts() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState(mockAlerts);

  const dismissAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 rounded-lg gradient-ai">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </div>
            {t("ai.smartNotifications")}
            <AIBadge variant="inline" />
          </CardTitle>
          <span className="text-xs text-muted-foreground">{alerts.length} {t("common.active")}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t("ai.allCaughtUp")}</p>
            </div>
          ) : (
            alerts.map((alert, index) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "relative p-4 rounded-xl border transition-all duration-300 hover:shadow-md animate-fade-in",
                    config.bg, config.border, priorityStyles[alert.priority]
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-background/50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div className="flex gap-3">
                    <div className={cn("p-2 rounded-lg bg-background/50", config.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-foreground">{t(alert.titleKey)}</h4>
                        {alert.priority === "high" && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-warning/20 text-warning">
                            {t("ai.urgent")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t(alert.messageKey)}</p>
                      <span className="text-[10px] text-muted-foreground/70 mt-2 block">
                        {t(alert.timeKey, { count: alert.timeCount })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
