import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { ExpenseFilters } from "@/components/expense/ExpenseFilters";
import { ExpenseTable } from "@/components/expense/ExpenseTable";
import { Button } from "@/components/ui/button";
import { mockExpenses, Expense } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function Expenses() {
  const { t } = useTranslation();
  const { formatCurrency } = usePreferences();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  const filteredExpenses = useMemo(() => {
    let result = [...mockExpenses];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(searchLower) ||
          e.notes?.toLowerCase().includes(searchLower)
      );
    }

    if (category !== "all") {
      result = result.filter((e) => e.category === category);
    }

    if (dateRange?.from) {
      result = result.filter((e) => {
        const expenseDate = new Date(e.date);
        const from = dateRange.from!;
        const to = dateRange.to || from;
        return expenseDate >= from && expenseDate <= to;
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc": return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount-asc": return a.amount - b.amount;
        case "amount-desc": return b.amount - a.amount;
        default: return 0;
      }
    });

    return result;
  }, [search, category, sortBy, dateRange]);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("date-desc");
    setDateRange(undefined);
  };

  const handleEdit = (expense: Expense) => {
    toast({ title: t("common.edit"), description: expense.description });
  };

  const handleDelete = (expense: Expense) => {
    toast({ title: t("common.delete"), description: expense.description, variant: "destructive" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("expensesPage.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("expensesPage.subtitle")}</p>
        </div>
        <Button asChild className="gradient-primary hover:opacity-90">
          <Link to="/add-expense">
            <Plus className="w-4 h-4 mr-2" />
            {t("nav.addExpense")}
          </Link>
        </Button>
      </div>

      <ExpenseFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onClearFilters={handleClearFilters}
      />

      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {t("expensesPage.showing")} <span className="font-medium text-foreground">{filteredExpenses.length}</span> {t("expensesPage.expensesCount")}
        </p>
        <p className="text-muted-foreground">
          {t("common.total")}: <span className="font-semibold text-primary">{formatCurrency(totalAmount)}</span>
        </p>
      </div>

      <ExpenseTable expenses={filteredExpenses} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
