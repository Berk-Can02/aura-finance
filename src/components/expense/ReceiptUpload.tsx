import { useState, useCallback } from "react";
import { Upload, Camera, Image, Loader2, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "processing" | "complete";

export function ReceiptUpload() {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = usePreferences();
  const [state, setState] = useState<UploadState>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const mockOCRResults = {
    vendor: "Fresh Market",
    date: new Date(),
    items: [
      { name: "Item A", price: 5.99 },
      { name: "Item B", price: 4.50 },
      { name: "Item C", price: 6.99 },
      { name: "Item D", price: 12.50 },
    ],
    total: 29.98,
    categoryKey: "food",
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setState("uploading");
    setTimeout(() => setState("processing"), 1000);
    setTimeout(() => setState("complete"), 2500);
  };

  const handleReset = () => { setState("idle"); setFileName(""); };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{t("addExpensePage.receipt.title")}</CardTitle>
        <CardDescription>{t("addExpensePage.receipt.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {state === "idle" && (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("addExpensePage.receipt.dragDrop")}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("addExpensePage.receipt.orBrowse")}</p>
                </div>
                <input
                  type="file" accept="image/*" onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ position: "relative" }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <label className="cursor-pointer">
                  <Image className="w-4 h-4 mr-2" />
                  {t("addExpensePage.receipt.chooseFile")}
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              </Button>
              <Button variant="outline" className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                {t("addExpensePage.receipt.takePhoto")}
              </Button>
            </div>
          </>
        )}

        {(state === "uploading" || state === "processing") && (
          <div className="text-center py-8 animate-fade-in">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="font-medium text-foreground">
              {state === "uploading" ? t("addExpensePage.receipt.uploading") : t("addExpensePage.receipt.extracting")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
          </div>
        )}

        {state === "complete" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-success">
              <Check className="w-5 h-5" />
              <span className="font-medium">{t("addExpensePage.receipt.success")}</span>
            </div>

            <div className="p-4 bg-muted rounded-xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("addExpensePage.receipt.vendor")}</span>
                <span className="font-medium text-foreground">{mockOCRResults.vendor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("addExpensePage.receipt.date")}</span>
                <span className="font-medium text-foreground">{formatDate(mockOCRResults.date, { year: "numeric", month: "short", day: "numeric" })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("addExpensePage.receipt.category")}</span>
                <span className="font-medium text-foreground">{t(`categories.${mockOCRResults.categoryKey}`)}</span>
              </div>

              <div className="border-t border-border pt-3 mt-3">
                <p className="text-sm text-muted-foreground mb-2">{t("addExpensePage.receipt.items")}</p>
                <div className="space-y-1">
                  {mockOCRResults.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-foreground">{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span className="text-foreground">{t("addExpensePage.receipt.total")}</span>
                <span className="text-primary">{formatCurrency(mockOCRResults.total)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                <X className="w-4 h-4 mr-2" /> {t("common.cancel")}
              </Button>
              <Button className="flex-1 gradient-primary hover:opacity-90">
                <Check className="w-4 h-4 mr-2" /> {t("addExpensePage.receipt.saveExpense")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
