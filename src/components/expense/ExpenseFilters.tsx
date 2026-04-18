import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface ExpenseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onClearFilters: () => void;
}

export function ExpenseFilters({
  search, onSearchChange, category, onCategoryChange,
  sortBy, onSortChange, dateRange, onDateRangeChange, onClearFilters,
}: ExpenseFiltersProps) {
  const { t } = useTranslation();
  const hasActiveFilters = search || category !== "all" || sortBy !== "date-desc" || dateRange;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("expensesPage.searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("expensesPage.categoryPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("expensesPage.allCategories")}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {t(`categories.${cat.id}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("expensesPage.sortPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">{t("expensesPage.sortNewest")}</SelectItem>
            <SelectItem value="date-asc">{t("expensesPage.sortOldest")}</SelectItem>
            <SelectItem value="amount-desc">{t("expensesPage.sortHighest")}</SelectItem>
            <SelectItem value="amount-asc">{t("expensesPage.sortLowest")}</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn(
              "w-full sm:w-auto justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>{format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}</>
                ) : (
                  format(dateRange.from, "LLL dd, yyyy")
                )
              ) : (
                t("expensesPage.dateRange")
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">{t("expensesPage.activeFilters")}</span>
          {search && (
            <Badge variant="secondary" className="gap-1">
              {t("expensesPage.searchLabel")}: {search}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onSearchChange("")} />
            </Badge>
          )}
          {category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {t(`categories.${category}`)}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onCategoryChange("all")} />
            </Badge>
          )}
          {dateRange && (
            <Badge variant="secondary" className="gap-1">
              {format(dateRange.from!, "MMM d")} - {dateRange.to ? format(dateRange.to, "MMM d") : "..."}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onDateRangeChange(undefined)} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-destructive hover:text-destructive">
            {t("common.clearAll")}
          </Button>
        </div>
      )}
    </div>
  );
}
