import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Sparkles, Target, Zap, Shield, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AIBadge } from "./AIBadge";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

interface BudgetPrediction {
  categoryKey: string;
  predictedSpend: number;
  budgetLimit: number;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  suggestionKey: string;
}

const predictions: BudgetPrediction[] = [
  { categoryKey: "food", predictedSpend: 720, budgetLimit: 600, confidence: 87, riskLevel: "high", suggestionKey: "ai.predictions.food" },
  { categoryKey: "transport", predictedSpend: 230, budgetLimit: 300, confidence: 92, riskLevel: "low", suggestionKey: "ai.predictions.transport" },
  { categoryKey: "entertainment", predictedSpend: 195, budgetLimit: 200, confidence: 78, riskLevel: "medium", suggestionKey: "ai.predictions.entertainment" },
  { categoryKey: "shopping", predictedSpend: 280, budgetLimit: 350, confidence: 85, riskLevel: "low", suggestionKey: "ai.predictions.shopping" },
];

const riskStyles = {
  low: { bg: "bg-success/10", border: "border-success/30", text: "text-success", icon: Shield, labelKey: "ai.riskLow" },
  medium: { bg: "bg-warning/10", border: "border-warning/30", text: "text-warning", icon: Target, labelKey: "ai.riskMedium" },
  high: { bg: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive", icon: Zap, labelKey: "ai.riskHigh" },
};

export function AIBudgetPredictions() {
  const { t } = useTranslation();
  const { formatCurrency } = usePreferences();
  const totalPredicted = predictions.reduce((s, p) => s + p.predictedSpend, 0);
  const totalBudget = predictions.reduce((s, p) => s + p.budgetLimit, 0);
  const overallStatus = totalPredicted <= totalBudget ? "on-track" : "at-risk";

  return (
    <Card className="border-primary/20 gradient-ai-subtle">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 rounded-lg gradient-ai ai-pulse">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {t("ai.budgetPredictions")}
            <AIBadge variant="inline" />
          </CardTitle>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            overallStatus === "on-track" ? "bg-success/10 border border-success/30" : "bg-warning/10 border border-warning/30"
          )}>
            {overallStatus === "on-track" ? <TrendingDown className="w-4 h-4 text-success" /> : <TrendingUp className="w-4 h-4 text-warning" />}
            <span className={cn("text-sm font-medium", overallStatus === "on-track" ? "text-success" : "text-warning")}>
              {overallStatus === "on-track" ? t("ai.onTrack") : t("ai.attentionNeeded")}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{t("ai.monthEndForecast")}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {predictions.map((prediction, index) => {
            const risk = riskStyles[prediction.riskLevel];
            const RiskIcon = risk.icon;
            const percentOfBudget = Math.round((prediction.predictedSpend / prediction.budgetLimit) * 100);

            return (
              <div
                key={prediction.categoryKey}
                className={cn("p-4 rounded-xl border transition-all duration-300 hover:shadow-md animate-fade-in", risk.bg, risk.border)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{t(`categories.${prediction.categoryKey}`)}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <RiskIcon className={cn("w-3.5 h-3.5", risk.text)} />
                      <span className={cn("text-xs font-medium capitalize", risk.text)}>{t(risk.labelKey)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{formatCurrency(prediction.predictedSpend)}</p>
                    <p className="text-xs text-muted-foreground">{t("common.of")} {formatCurrency(prediction.budgetLimit)}</p>
                  </div>
                </div>

                <div className="relative h-2 bg-background/50 rounded-full overflow-hidden mb-3">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", {
                      "bg-success": percentOfBudget <= 80,
                      "bg-warning": percentOfBudget > 80 && percentOfBudget <= 100,
                      "bg-destructive": percentOfBudget > 100,
                    })}
                    style={{ width: `${Math.min(percentOfBudget, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">{t("ai.confidence")}</span>
                  <span className="font-medium text-foreground">{prediction.confidence}%</span>
                </div>

                <div className="pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">{t("ai.suggestion")}</span> {t(prediction.suggestionKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-background/60 border border-border/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("ai.predictedTotal")}</p>
                <p className="text-xs text-muted-foreground">{t("ai.basedOnPatterns")}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPredicted)}</p>
              <p className={cn("text-sm font-medium", totalPredicted <= totalBudget ? "text-success" : "text-warning")}>
                {totalPredicted <= totalBudget
                  ? t("ai.underBudget", { amount: formatCurrency(totalBudget - totalPredicted) })
                  : t("ai.overBudget", { amount: formatCurrency(totalPredicted - totalBudget) })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
