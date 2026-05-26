'use client';

import { useState, useEffect } from 'react';
import { useAppForm } from '@/app/form-context';
import type { AppPermission } from '@/app/form-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const permissionList: { id: AppPermission; label: string; disabled?: boolean }[] = [
    { id: 'INTERNET', label: 'INTERNET', disabled: true },
    { id: 'ACCESS_NETWORK_STATE', label: 'ACCESS_NETWORK_STATE', disabled: true },
    { id: 'ACCESS_COARSE_LOCATION', label: 'ACCESS_COARSE_LOCATION' },
    { id: 'ACCESS_FINE_LOCATION', label: 'ACCESS_FINE_LOCATION' },
    { id: 'CAMERA', label: 'CAMERA' },
    { id: 'READ_EXTERNAL_STORAGE', label: 'READ_EXTERNAL_STORAGE' },
    { id: 'READ_MEDIA_IMAGES', label: 'READ_MEDIA_IMAGES' },
    { id: 'READ_MEDIA_VIDEO', label: 'READ_MEDIA_VIDEO' },
    { id: 'READ_MEDIA_AUDIO', label: 'READ_MEDIA_AUDIO' },
    { id: 'WRITE_EXTERNAL_STORAGE', label: 'WRITE_EXTERNAL_STORAGE' },
    { id: 'RECORD_AUDIO', label: 'RECORD_AUDIO' },
    { id: 'MODIFY_AUDIO_SETTINGS', label: 'MODIFY_AUDIO_SETTINGS' },
    { id: 'VIBRATE', label: 'VIBRATE' },
  ];

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PermissionsDialog({ open, onOpenChange }: PermissionsDialogProps) {
  const { state, dispatch } = useAppForm();
  const [selectedPermissions, setSelectedPermissions] = useState<AppPermission[]>(state.permissions);

  useEffect(() => {
    if (open) {
      setSelectedPermissions(state.permissions);
    }
  }, [open, state.permissions]);

  const handleCheckboxChange = (permission: AppPermission, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, permission] : prev.filter((p) => p !== permission)
    );
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_FIELD', field: 'permissions', value: selectedPermissions });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Customize Permissions</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="p-6">
            <p className="mb-4 text-sm font-medium text-foreground">Select Permissions</p>
            <ScrollArea className="h-60 w-full">
                <div className="space-y-4 pr-6">
                    {permissionList.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(permission.id, !!checked)}
                            disabled={permission.disabled}
                        />
                        <Label htmlFor={permission.id} className={`font-normal text-sm ${permission.disabled ? 'text-muted-foreground' : ''}`}>
                            {permission.label}
                        </Label>
                    </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
        <Separator />
        <DialogFooter className="p-6 pt-4 sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="button" onClick={handleSave}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
