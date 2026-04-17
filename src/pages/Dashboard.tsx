import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { SpendingTrends } from "@/components/dashboard/SpendingTrends";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { AIFeatureHighlight } from "@/components/ai/AIFeatureHighlight";
import { AIPredictiveChart } from "@/components/ai/AIPredictiveChart";
import { AISmartAlerts } from "@/components/ai/AISmartAlerts";
import { Button } from "@/components/ui/button";
import { summaryData } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function Dashboard() {
  const { t } = useTranslation();
  const { formatCurrency, formatNumber } = usePreferences();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("dashboard.welcome")}</p>
        </div>
        <Button asChild className="gradient-primary hover:opacity-90 transition-opacity">
          <Link to="/add-expense">
            <Plus className="w-4 h-4 mr-2" />
            {t("nav.addExpense")}
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <SummaryCard
          title={t("dashboard.totalBalance")}
          value={formatCurrency(summaryData.totalBalance)}
          icon={Wallet}
          variant="primary"
        />
        <SummaryCard
          title={t("dashboard.monthlyIncome")}
          value={formatCurrency(summaryData.monthlyIncome)}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <SummaryCard
          title={t("dashboard.monthlyExpenses")}
          value={formatCurrency(summaryData.monthlyExpenses)}
          icon={TrendingDown}
          trend={{ value: 8, isPositive: false }}
        />
        <SummaryCard
          title={t("dashboard.savingsRate")}
          value={`${formatNumber(summaryData.savingsRate)}%`}
          icon={PiggyBank}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* AI Feature Highlight */}
      <AIFeatureHighlight />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart />
        <SpendingTrends />
      </div>

      {/* AI Predictive Analysis */}
      <AIPredictiveChart />

      {/* AI Recommendations & Smart Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIRecommendations />
        </div>
        <AISmartAlerts />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
