import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { weeklySpendingData, monthlySpendingData } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

type ViewType = "weekly" | "monthly";
type ChartType = "bar" | "line";

export function SpendingTrends() {
  const { t } = useTranslation();
  const { formatCurrency } = usePreferences();
  const [view, setView] = useState<ViewType>("weekly");
  const [chartType, setChartType] = useState<ChartType>("bar");

  const rawData = view === "weekly" ? weeklySpendingData : monthlySpendingData;
  const xKey = view === "weekly" ? "day" : "month";
  const data = rawData.map((d: any) => ({
    ...d,
    [xKey]: view === "weekly" ? t(`weekdays.${d.day}`, d.day) : t(`months.${monthMap[d.month] ?? d.month}`, d.month),
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold">{t("dashboard.spendingTrends")}</CardTitle>
          <div className="flex gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setView("weekly")}
                className={cn("h-7 px-3 text-xs", view === "weekly" && "bg-background shadow-sm")}
              >
                {t("dashboard.weekly")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setView("monthly")}
                className={cn("h-7 px-3 text-xs", view === "monthly" && "bg-background shadow-sm")}
              >
                {t("dashboard.monthly")}
              </Button>
            </div>
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setChartType("bar")}
                className={cn("h-7 px-3 text-xs", chartType === "bar" && "bg-background shadow-sm")}
              >
                {t("dashboard.bar")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setChartType("line")}
                className={cn("h-7 px-3 text-xs", chartType === "line" && "bg-background shadow-sm")}
              >
                {t("dashboard.line")}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={data}>
                <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, { maximumFractionDigits: 0 })} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), t("dashboard.spent")]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} animationDuration={800} />
              </BarChart>
            ) : (
              <LineChart data={data}>
                <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, { maximumFractionDigits: 0 })} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), t("dashboard.spent")]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }} activeDot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 6 }} animationDuration={800} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const monthMap: Record<string, string> = {
  Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June",
  Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};
