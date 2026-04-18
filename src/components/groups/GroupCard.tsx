import { Users, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Group, getTotalGroupExpenses, getUserBalance } from "@/data/groupsData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  const { t } = useTranslation();
  const { formatCurrency } = usePreferences();
  const totalExpenses = getTotalGroupExpenses(group);
  const userBalance = getUserBalance(group, "user-1");

  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30 group" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {group.members.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                  <AvatarFallback className="text-xs bg-muted">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {group.members.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                  +{group.members.length - 4}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {group.members.length} {t("common.members")}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">{t("groupsPage.totalExpenses")}</p>
              <p className="font-semibold">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t("groupsPage.yourBalance")}</p>
              <Badge
                variant="secondary"
                className={cn(
                  "font-semibold",
                  userBalance > 0 && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  userBalance < 0 && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                  userBalance === 0 && "bg-muted text-muted-foreground"
                )}
              >
                {userBalance === 0 ? t("common.settled") : `${userBalance > 0 ? "+" : ""}${formatCurrency(userBalance)}`}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
