import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, TrendingUp, Shield, Zap, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function AIFeatureHighlight() {
  const { t } = useTranslation();
  const features = [
    { icon: Brain, titleKey: "ai.smartAnalysis", descKey: "ai.smartAnalysisDesc", color: "text-primary", bgColor: "bg-primary/10" },
    { icon: TrendingUp, titleKey: "ai.predictiveInsights", descKey: "ai.predictiveInsightsDesc", color: "text-secondary", bgColor: "bg-secondary/10" },
    { icon: Shield, titleKey: "ai.anomalyDetection", descKey: "ai.anomalyDetectionDesc", color: "text-accent", bgColor: "bg-accent/10" },
    { icon: Target, titleKey: "ai.goalTracking", descKey: "ai.goalTrackingDesc", color: "text-success", bgColor: "bg-success/10" },
  ];

  return (
    <Card className="border-primary/30 overflow-hidden relative">
      <div className="absolute inset-0 gradient-ai opacity-5" />
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl gradient-ai ai-glow">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              {t("ai.poweredBy")}
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full gradient-ai text-primary-foreground">
                {t("ai.smart")}
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">{t("ai.advancedML")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className="group p-4 rounded-xl bg-background/60 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn("p-2 rounded-lg w-fit mb-3", feature.bgColor)}>
                  <Icon className={cn("w-5 h-5", feature.color)} />
                </div>
                <h4 className="font-medium text-sm text-foreground mb-1">{t(feature.titleKey)}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">98%</p>
              <p className="text-xs text-muted-foreground">{t("ai.accuracy")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">2.5s</p>
              <p className="text-xs text-muted-foreground">{t("ai.analysisTime")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-xs text-muted-foreground">{t("ai.monitoring")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/30">
            <Zap className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">{t("ai.active")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
