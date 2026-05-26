import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-border rounded-lg p-12">
            <div className="bg-muted rounded-full p-4">
              <SettingsIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-primary-foreground">
              Settings Page
            </h3>
            <p className="text-muted-foreground">
              Application settings and preferences will be available here in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
