import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { categories } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function ManualEntryForm() {
  const { t } = useTranslation();
  const { formatCurrency } = usePreferences();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    amount: z.string().min(1, t("addExpensePage.manual.errors.amountRequired")).refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      t("addExpensePage.manual.errors.amountPositive")
    ),
    category: z.string().min(1, t("addExpensePage.manual.errors.categoryRequired")),
    description: z.string().min(1, t("addExpensePage.manual.errors.descRequired")).max(100, t("addExpensePage.manual.errors.descTooLong")),
    date: z.date({ required_error: t("addExpensePage.manual.errors.dateRequired") }),
    notes: z.string().max(500, t("addExpensePage.manual.errors.notesTooLong")).optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: "", category: "", description: "", date: new Date(), notes: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    toast({
      title: t("addExpensePage.manual.added"),
      description: t("addExpensePage.manual.addedDesc", {
        amount: formatCurrency(parseFloat(data.amount)),
        description: data.description,
      }),
    });
    form.reset();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{t("addExpensePage.manual.title")}</CardTitle>
        <CardDescription>{t("addExpensePage.manual.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="amount" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("addExpensePage.manual.amount")}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("addExpensePage.manual.category")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("addExpensePage.manual.selectCategory")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{t(`categories.${cat.id}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("addExpensePage.manual.descriptionLabel")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("addExpensePage.manual.descriptionPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("addExpensePage.manual.date")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>{t("addExpensePage.manual.pickDate")}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("addExpensePage.manual.notes")}</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder={t("addExpensePage.manual.notesPlaceholder")} className="resize-none" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full gradient-primary hover:opacity-90" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("addExpensePage.manual.saving")}</>
              ) : (
                t("addExpensePage.manual.addExpense")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
