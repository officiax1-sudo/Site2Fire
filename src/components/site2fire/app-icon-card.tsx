'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImageUpload } from './image-upload';
import { useAppForm } from '@/app/form-context';

export function AppIconCard() {
  const { state, dispatch } = useAppForm();

  return (
    <Card>
      <CardHeader className="text-center md:text-left">
        <CardTitle>App Icon</CardTitle>
        <CardDescription>
          Upload a 512x512 pixel icon for your application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ImageUpload
          value={state.appIcon}
          onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'appIcon', value })}
          width={512}
          height={512}
        />
      </CardContent>
    </Card>
  );
}
