import { useState } from "react";
import {
  User, Palette, Bell, Shield, CreditCard, Globe, Camera, Save, LogOut, Trash2, ChevronRight, Moon, Sun,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { usePreferences, SupportedCurrency } from "@/contexts/PreferencesContext";
import { SupportedLanguage } from "@/i18n";

export default function Settings() {
  const { t } = useTranslation();
  const { language, currency, setLanguage, setCurrency } = usePreferences();

  const [profile, setProfile] = useState({
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phone: "+90 555 123 4567",
  });
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [accentColor, setAccentColor] = useState("Green");
  const [dashboardLayout, setDashboardLayout] = useState("Comfortable");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true, push: true, budgetAlerts: true, weeklyReport: true, aiInsights: true, billReminders: true,
  });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const handleToggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  const handleSaveProfile = () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast({ title: t("settings.toasts.validationError"), description: t("settings.toasts.nameEmailRequired"), variant: "destructive" });
      return;
    }
    toast({ title: t("settings.toasts.profileSaved"), description: t("settings.toasts.profileSavedDesc") });
  };

  const handleSaveNotifications = () => {
    toast({ title: t("settings.toasts.notifSaved"), description: t("settings.toasts.notifSavedDesc") });
  };

  const handleSaveAppearance = () => {
    toast({ title: t("settings.toasts.appearanceSaved"), description: t("settings.toasts.appearanceSavedDesc") });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
    toast({ title: t("settings.toasts.preferencesSaved"), description: t("settings.toasts.preferencesSavedDesc") });
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as SupportedCurrency);
    toast({ title: t("settings.toasts.preferencesSaved"), description: t("settings.toasts.preferencesSavedDesc") });
  };

  const handleUpdatePassword = () => {
    if (!passwords.current) {
      toast({ title: t("settings.toasts.error"), description: t("settings.toasts.passwordRequired"), variant: "destructive" });
      return;
    }
    if (passwords.new.length < 8) {
      toast({ title: t("settings.toasts.error"), description: t("settings.toasts.passwordMin"), variant: "destructive" });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast({ title: t("settings.toasts.error"), description: t("settings.toasts.passwordMismatch"), variant: "destructive" });
      return;
    }
    setPasswords({ current: "", new: "", confirm: "" });
    toast({ title: t("settings.toasts.passwordUpdated"), description: t("settings.toasts.passwordUpdatedDesc") });
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? t("settings.toasts.twoFADisabled") : t("settings.toasts.twoFAEnabled"),
      description: twoFactorEnabled ? t("settings.toasts.twoFADisabledDesc") : t("settings.toasts.twoFAEnabledDesc"),
    });
  };

  const handleDeleteAccount = () => {
    toast({ title: t("settings.toasts.actionRequired"), description: t("settings.toasts.deleteAccountConfirm"), variant: "destructive" });
  };

  const handleLogout = () => {
    toast({ title: t("settings.toasts.loggedOut"), description: t("settings.toasts.loggedOutDesc") });
  };

  const notifItems = [
    { key: "email" as const, title: t("settings.notifications.email"), desc: t("settings.notifications.emailDesc") },
    { key: "push" as const, title: t("settings.notifications.push"), desc: t("settings.notifications.pushDesc") },
    { key: "budgetAlerts" as const, title: t("settings.notifications.budgetAlerts"), desc: t("settings.notifications.budgetAlertsDesc") },
    { key: "weeklyReport" as const, title: t("settings.notifications.weeklyReport"), desc: t("settings.notifications.weeklyReportDesc") },
    { key: "aiInsights" as const, title: t("settings.notifications.aiInsights"), desc: t("settings.notifications.aiInsightsDesc") },
    { key: "billReminders" as const, title: t("settings.notifications.billReminders"), desc: t("settings.notifications.billRemindersDesc") },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
          <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> {t("settings.tabs.profile")}</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="w-4 h-4" /> {t("settings.tabs.appearance")}</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> {t("settings.tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="w-4 h-4" /> {t("settings.tabs.security")}</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("settings.profile.title")}</CardTitle>
              <CardDescription>{t("settings.profile.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">AY</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="w-4 h-4" /> {t("settings.profile.changePhoto")}
                  </Button>
                  <p className="text-xs text-muted-foreground">{t("settings.profile.photoHint")}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("settings.profile.fullName")}</Label>
                  <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.profile.email")}</Label>
                  <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("settings.profile.phone")}</Label>
                  <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="w-4 h-4" /> {t("common.saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("settings.profile.regional")}</CardTitle>
              <CardDescription>{t("settings.profile.regionalDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted-foreground" /> {t("settings.profile.currency")}</Label>
                  <Select value={currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="TRY">₺ Turkish Lira (TRY)</SelectItem>
                      <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-muted-foreground" /> {t("settings.profile.language")}</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="tr">Türkçe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("settings.appearance.title")}</CardTitle>
              <CardDescription>{t("settings.appearance.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("settings.appearance.darkMode")}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.appearance.darkModeDesc")}</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>{t("settings.appearance.accentColor")}</Label>
                <div className="flex gap-3">
                  {[
                    { name: "Green", class: "bg-primary" },
                    { name: "Blue", class: "bg-[hsl(210,80%,50%)]" },
                    { name: "Purple", class: "bg-[hsl(270,70%,55%)]" },
                    { name: "Orange", class: "bg-[hsl(25,90%,55%)]" },
                    { name: "Pink", class: "bg-[hsl(340,75%,55%)]" },
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setAccentColor(color.name)}
                      className={`w-9 h-9 rounded-full ${color.class} ring-2 ring-offset-2 ring-offset-background ${accentColor === color.name ? "ring-primary" : "ring-transparent"} hover:scale-110 transition-transform`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>{t("settings.appearance.dashboardLayout")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "Compact", label: t("settings.appearance.compact") },
                    { id: "Comfortable", label: t("settings.appearance.comfortable") },
                  ].map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => setDashboardLayout(layout.id)}
                      className={`p-4 rounded-lg border text-sm font-medium text-center transition-colors ${
                        dashboardLayout === layout.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {layout.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAppearance} className="gap-2">
                  <Save className="w-4 h-4" /> {t("common.savePreferences")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("settings.notifications.title")}</CardTitle>
              <CardDescription>{t("settings.notifications.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {notifItems.map((item, index) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                    />
                  </div>
                  {index < notifItems.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveNotifications} className="gap-2">
                  <Save className="w-4 h-4" /> {t("common.savePreferences")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("settings.security.passwordTitle")}</CardTitle>
              <CardDescription>{t("settings.security.passwordDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t("settings.security.currentPassword")}</Label>
                <Input id="current-password" type="password" placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("settings.security.newPassword")}</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("settings.security.confirmPassword")}</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleUpdatePassword} className="gap-2"><Save className="w-4 h-4" /> {t("settings.security.updatePassword")}</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("settings.security.twoFATitle")}</CardTitle>
              <CardDescription>{t("settings.security.twoFADesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{twoFactorEnabled ? t("settings.security.twoFAEnabled") : t("settings.security.twoFADisabled")}</p>
                    <p className="text-xs text-muted-foreground">{twoFactorEnabled ? t("settings.security.twoFAEnabledDesc") : t("settings.security.twoFADisabledDesc")}</p>
                  </div>
                </div>
                <Button variant={twoFactorEnabled ? "destructive" : "outline"} size="sm" onClick={handleToggle2FA}>
                  {twoFactorEnabled ? t("settings.security.disable") : t("settings.security.enable")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">{t("settings.security.dangerZone")}</CardTitle>
              <CardDescription>{t("settings.security.dangerZoneDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("settings.security.logoutAll")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.security.logoutAllDesc")}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" /> {t("settings.security.logout")}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("settings.security.deleteAccount")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.security.deleteAccountDesc")}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount} className="gap-2">
                  <Trash2 className="w-4 h-4" /> {t("common.delete")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
