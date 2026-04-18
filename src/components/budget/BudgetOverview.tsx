import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSpentPercentage } from "@/data/budgetData";
import { usePreferences } from "@/contexts/PreferencesContext";

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  month: string;
  year: number;
}

export function BudgetOverview({ totalBudget, totalSpent, month, year }: BudgetOverviewProps) {
  const { t } = useTranslation();
  const { formatCurrency } = usePreferences();
  const remaining = totalBudget - totalSpent;
  const percentage = getSpentPercentage(totalSpent, totalBudget);
  const isOverBudget = remaining < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t("budgetPage.monthlyBudget")}</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full"><Wallet className="h-4 w-4 text-primary" /></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</div>
          <p className="text-xs text-muted-foreground mt-1">{t(`months.${month}`)} {year}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t("budgetPage.totalSpent")}</CardTitle>
          <div className="p-2 bg-chart-3/10 rounded-full"><TrendingUp className="h-4 w-4 text-chart-3" /></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</div>
          <p className="text-xs text-muted-foreground mt-1">{t("budgetPage.percentUsed", { percent: percentage })}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t("budgetPage.remaining")}</CardTitle>
          <div className={`p-2 rounded-full ${isOverBudget ? 'bg-destructive/10' : 'bg-chart-1/10'}`}>
            {isOverBudget ? <TrendingDown className="h-4 w-4 text-destructive" /> : <PiggyBank className="h-4 w-4 text-chart-1" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
            {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remaining))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isOverBudget ? t("budgetPage.overBudget") : t("budgetPage.available")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t("budgetPage.budgetProgress")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={Math.min(percentage, 100)} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t("budgetPage.used", { percent: percentage })}</span>
              <span>{t("budgetPage.left", { percent: 100 - Math.min(percentage, 100) })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
