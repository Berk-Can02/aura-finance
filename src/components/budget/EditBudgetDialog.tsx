import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BudgetCategory } from "@/data/budgetData";
import { usePreferences } from "@/contexts/PreferencesContext";

interface EditBudgetDialogProps {
  category: BudgetCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (categoryId: string, newAmount: number) => void;
}

export function EditBudgetDialog({ category, open, onOpenChange, onSave }: EditBudgetDialogProps) {
  const { t } = useTranslation();
  const { formatCurrency } = usePreferences();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setAmount(category?.allocated.toString() || "");
  }, [category]);

  const handleSave = () => {
    if (category && amount) {
      onSave(category.id, parseFloat(amount));
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("budgetPage.editBudget")}</DialogTitle>
        </DialogHeader>
        {category && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">{t("budgetPage.category")}</Label>
              <p className="font-medium text-foreground">{t(`categories.${category.categoryId}`)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">{t("budgetPage.currentSpending")}</Label>
              <p className="font-medium text-foreground">{formatCurrency(category.spent)}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-amount">{t("budgetPage.budgetAmount")}</Label>
              <Input id="budget-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t("budgetPage.enterAmount")} className="text-lg" />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
          <Button onClick={handleSave}>{t("common.saveChanges")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
