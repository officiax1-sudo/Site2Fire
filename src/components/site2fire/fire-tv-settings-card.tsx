'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppForm } from '@/app/form-context';
import { Button } from '../ui/button';
import { PermissionsDialog } from './permissions-dialog';
import { Settings2, Tv } from 'lucide-react';

export function AndroidSettingsCard() {
  const { state, dispatch } = useAppForm();
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="text-center md:text-left">
          <CardTitle className="flex items-center gap-2 justify-center md:justify-start">
            <Tv className="h-5 w-5 text-primary" />
            Fire TV / Android TV Settings
          </CardTitle>
          <CardDescription>
            Optimize your application for TV and Fire Stick devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dpad-support" className="text-base">D-Pad Navigation Support</Label>
              <p className="text-sm text-muted-foreground">
                Enhance focus management for remote control navigation (Up, Down, Left, Right).
              </p>
            </div>
            <Switch
              id="dpad-support"
              checked={state.dpadSupport}
              onCheckedChange={(checked) =>
                dispatch({ type: 'UPDATE_FIELD', field: 'dpadSupport', value: checked })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orientation">Default Orientation</Label>
            <Select
              value={state.orientation}
              onValueChange={(value) =>
                dispatch({ type: 'UPDATE_FIELD', field: 'orientation', value })
              }
            >
              <SelectTrigger id="orientation" className="w-full">
                <SelectValue placeholder="Select orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landscape">Landscape (Recommended for TV)</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="auto">Auto Rotate</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Landscape is the standard orientation for most TV applications.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={() => setPermissionsDialogOpen(true)}>
                <Settings2 className="mr-2 h-4 w-4" />
                Customize App Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
      <PermissionsDialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen} />
    </>
  );
}
