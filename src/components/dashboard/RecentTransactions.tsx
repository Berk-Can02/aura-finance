import { Utensils, Car, Gamepad2, ShoppingBag, Zap, Heart, Plane, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockExpenses, categories } from "@/data/mockData";
import { Link } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils, Car, Gamepad2, ShoppingBag, Zap, Heart, Plane, MoreHorizontal,
};

export function RecentTransactions() {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = usePreferences();
  const recentExpenses = mockExpenses.slice(0, 5);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
  };

  const formatRelative = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t("common.today");
    if (diffDays === 1) return t("common.yesterday");
    return formatDate(date);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{t("dashboard.recentTransactions")}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/expenses" className="text-primary hover:text-primary/80">
              {t("common.viewAll")}
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {recentExpenses.map((expense, index) => {
            const category = getCategoryInfo(expense.category);
            const Icon = iconMap[category.icon] || MoreHorizontal;

            return (
              <div
                key={expense.id}
                className={cn("flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors", "animate-fade-in")}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">{t(`categories.${category.id}`, category.name)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-foreground">-{formatCurrency(expense.amount)}</p>
                  <p className="text-sm text-muted-foreground">{formatRelative(expense.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
