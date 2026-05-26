'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppForm } from '@/app/form-context';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const urlSchema = z.string().url();

export function ProjectConfigCard() {
  const { state, dispatch } = useAppForm();
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    const result = urlSchema.safeParse(state.webUrl);
    setUrlError(result.success || state.webUrl === '' ? null : 'Please enter a valid URL.');
  }, [state.webUrl]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    dispatch({ type: 'UPDATE_FIELD', field: 'projectTitle', value: title });
  };
  
  useEffect(() => {
    // Generate a sanitized slug from the App Title for the package name
    const sanitizedTitle = state.projectTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");
    
    const newPackageName = `com.site2fire.${sanitizedTitle || 'myapp'}`;
    
    if (newPackageName !== state.packageName) {
        dispatch({ type: 'UPDATE_FIELD', field: 'packageName', value: newPackageName });
    }
  }, [state.projectTitle, state.packageName, dispatch]);
  
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    if (value && !/^https?:\/\//i.test(value)) {
      value = 'https://' + value;
      dispatch({ type: 'UPDATE_FIELD', field: 'webUrl', value });
    }
  };


  return (
    <Card>
      <CardHeader className="text-center md:text-left">
        <CardTitle>Project Configuration</CardTitle>
        <CardDescription>
          Enter the basic details for your Android TV application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="app-title">App Title</Label>
          <Input
            id="app-title"
            placeholder="e.g., My Awesome News Site"
            value={state.projectTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="web-url">Web URL</Label>
          <Input
            id="web-url"
            type="url"
            placeholder="https://example.com"
            value={state.webUrl}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_FIELD', field: 'webUrl', value: e.target.value })
            }
            onBlur={handleUrlBlur}
            className={urlError ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {urlError && <p className="text-sm text-destructive">{urlError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-name">Package Name</Label>
          <Input
            id="package-name"
            placeholder="com.site2fire.myapp"
            value={state.packageName}
            readOnly
          />
          <p className="text-sm text-muted-foreground text-center md:text-left">
            A unique identifier for your app, automatically generated from the App Title.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="version-name">Version Name</Label>
                <Input
                    id="version-name"
                    placeholder="1.0"
                    value={state.versionName}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'versionName', value: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="version-code">Version Code</Label>
                <Input
                    id="version-code"
                    type="number"
                    placeholder="1"
                    value={state.versionCode}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'versionCode', value: e.target.value })}
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
