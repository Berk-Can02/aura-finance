import { Utensils, Car, Gamepad2, ShoppingBag, Zap, Heart, Plane, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categories, Expense } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils, Car, Gamepad2, ShoppingBag, Zap, Heart, Plane, MoreHorizontal,
};

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = usePreferences();

  const getCategoryInfo = (categoryId: string) =>
    categories.find(c => c.id === categoryId) || categories[categories.length - 1];

  if (expenses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{t("expensesPage.noFound")}</h3>
        <p className="text-muted-foreground">{t("expensesPage.noFoundDesc")}</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="hidden md:block overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("expensesPage.thDate")}</TableHead>
              <TableHead>{t("expensesPage.thCategory")}</TableHead>
              <TableHead>{t("expensesPage.thDescription")}</TableHead>
              <TableHead className="text-right">{t("expensesPage.thAmount")}</TableHead>
              <TableHead className="text-right">{t("expensesPage.thActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => {
              const category = getCategoryInfo(expense.category);
              const Icon = iconMap[category.icon] || MoreHorizontal;

              return (
                <TableRow key={expense.id} className="animate-fade-in hover:bg-muted/30" style={{ animationDelay: `${index * 30}ms` }}>
                  <TableCell className="font-medium text-muted-foreground">
                    {formatDate(expense.date, { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                        <Icon className="w-4 h-4" style={{ color: category.color }} />
                      </div>
                      <span className="text-sm">{t(`categories.${category.id}`)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      {expense.notes && <p className="text-sm text-muted-foreground truncate max-w-[200px]">{expense.notes}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} className="h-8 w-8 hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(expense)} className="h-8 w-8 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="md:hidden space-y-3">
        {expenses.map((expense, index) => {
          const category = getCategoryInfo(expense.category);
          const Icon = iconMap[category.icon] || MoreHorizontal;

          return (
            <Card key={expense.id} className={cn("p-4 animate-fade-in")} style={{ animationDelay: `${index * 30}ms` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${category.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">{t(`categories.${category.id}`)}</p>
                    </div>
                    <p className="font-semibold text-foreground whitespace-nowrap">{formatCurrency(expense.amount)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.date, { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(expense)} className="h-8 w-8 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
