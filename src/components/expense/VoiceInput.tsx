import { useState } from "react";
import { Mic, MicOff, Loader2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

type RecordingState = "idle" | "recording" | "processing" | "complete";

export function VoiceInput() {
  const { t } = useTranslation();
  const { formatCurrency } = usePreferences();
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");

  const mockResults = {
    amount: 42.50,
    categoryKey: "food",
    description: t("addExpensePage.voice.description"),
  };

  const handleRecord = async () => {
    if (state === "idle") {
      setState("recording");
      setTranscript("");
      setTimeout(() => setTranscript("Spent 42.50 on lunch"), 1500);
      setTimeout(() => setState("processing"), 3000);
      setTimeout(() => setState("complete"), 4500);
    } else if (state === "recording") {
      setState("processing");
      setTimeout(() => setState("complete"), 1500);
    }
  };

  const handleReset = () => { setState("idle"); setTranscript(""); };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{t("addExpensePage.voice.title")}</CardTitle>
        <CardDescription>{t("addExpensePage.voice.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Button
            size="lg"
            onClick={handleRecord}
            disabled={state === "processing"}
            className={cn(
              "w-24 h-24 rounded-full transition-all duration-300",
              state === "recording" ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                : state === "complete" ? "bg-success hover:bg-success/90"
                : "gradient-primary hover:opacity-90"
            )}
          >
            {state === "idle" && <Mic className="w-10 h-10" />}
            {state === "recording" && <MicOff className="w-10 h-10" />}
            {state === "processing" && <Loader2 className="w-10 h-10 animate-spin" />}
            {state === "complete" && <Check className="w-10 h-10" />}
          </Button>
          {state === "recording" && (
            <>
              <div className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
              <div className="absolute inset-[-8px] rounded-full border-2 border-destructive/50 animate-pulse" />
            </>
          )}
        </div>

        <p className="text-center text-muted-foreground font-medium">
          {state === "idle" && t("addExpensePage.voice.tapStart")}
          {state === "recording" && t("addExpensePage.voice.listening")}
          {state === "processing" && t("addExpensePage.voice.processing")}
          {state === "complete" && t("addExpensePage.voice.detected")}
        </p>

        {transcript && (
          <div className="w-full p-4 bg-muted rounded-xl animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">{t("addExpensePage.voice.transcript")}</p>
            <p className="text-foreground italic">"{transcript}"</p>
          </div>
        )}

        {state === "complete" && (
          <div className="w-full space-y-4 animate-fade-in">
            <div className="p-4 bg-success/10 border border-success/20 rounded-xl">
              <p className="text-sm font-medium text-success mb-3">{t("addExpensePage.voice.extracted")}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("addExpensePage.voice.amount")}</span>
                  <p className="font-semibold text-foreground">{formatCurrency(mockResults.amount)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("addExpensePage.voice.category")}</span>
                  <p className="font-semibold text-foreground">{t(`categories.${mockResults.categoryKey}`)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">{t("addExpensePage.voice.description")}</span>
                  <p className="font-semibold text-foreground">{mockResults.description}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">{t("common.tryAgain")}</Button>
              <Button className="flex-1 gradient-primary hover:opacity-90">{t("addExpensePage.voice.saveExpense")}</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
