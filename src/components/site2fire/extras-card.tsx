'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppForm } from '@/app/form-context';
import type { AppFormState } from '@/app/form-context';

const extrasList: { id: keyof AppFormState; label: string; description?: string }[] = [
  { id: 'supportZoom', label: 'Support Zoom' },
  { id: 'zoomButtons', label: 'Zoom Buttons' },
  { id: 'sideScrollBars', label: 'Side ScrollBars' },
  { id: 'textSelection', label: 'Text Selection' },
  { id: 'saveFormData', label: 'Save Form Data' },
  { id: 'fullScreen', label: 'Full Screen' },
  { id: 'javaScriptAPIs', label: 'JavaScript APIs' },
  { id: 'httpsOnlyContent', label: 'HTTPs Only Content' },
  { id: 'allowExternalUrls', label: 'Allow External URLs' },
  { id: 'confirmOnExit', label: 'Confirm on Exit' },
  { id: 'enableGpsPrompt', label: 'Enable GPS Prompt' },
  { id: 'disallowScreenshot', label: 'Disallow Screenshot' },
  { id: 'allowFileAccess', label: 'Allow File Access' },
  { id: 'allowCrossOrigin', label: 'Allow Cross-Origin' },
  { id: 'showToolbar', label: 'Show Toolbar (Title)' },
  { id: 'liveToolbarTitle', label: 'Live Toolbar Title' },
  { id: 'homeButton', label: 'Home Button' },
  { id: 'pullToRefresh', label: 'Pull to Refresh' },
  { id: 'deepLinking', label: 'Deep-linking' },
  { id: 'popUpBlocker', label: 'Pop-up Blocker' },
];

export function ExtrasCard() {
  const { state, dispatch } = useAppForm();

  return (
    <Card>
      <CardHeader className="text-center md:text-left">
        <CardTitle>Extras</CardTitle>
        <CardDescription>
          Enable or disable optional application features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap">
          {extrasList.map((extra) => (
            <div key={extra.id} className="flex items-center w-1/2 py-1 pr-4">
              <Checkbox
                id={extra.id}
                className="mr-2"
                checked={!!state[extra.id]}
                onCheckedChange={(checked) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: extra.id,
                    value: !!checked,
                  })
                }
              />
              <Label htmlFor={extra.id} className="font-normal text-xs">
                {extra.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
