'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAppForm } from '@/app/form-context';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { generateScriptAction } from '@/app/actions';

type BuildStatus = 'idle' | 'building' | 'completed' | 'error';

const buildProcessSteps = [
  { progress: 10, message: "Initializing build environment..." },
  { progress: 25, message: "Validating configuration..." },
  { progress: 40, message: "Fetching web assets..." },
  { progress: 60, message: "Compiling resources..." },
  { progress: 80, message: "Packaging APK..." },
  { progress: 95, message: "Signing application..." },
  { progress: 100, message: "Build successful!" },
];

export function BuildCard() {
  const { state: appState, dispatch } = useAppForm();
  const [buildStatus, setBuildStatus] = useState<BuildStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBuild = async () => {
    const urlSchema = z.string().url();
    if (!appState.projectTitle) {
      setError("App Title is required to start a build.");
      setBuildStatus('error');
      return;
    }
    if (!urlSchema.safeParse(appState.webUrl).success) {
      setError("A valid Web URL is required to start a build.");
      setBuildStatus('error');
      return;
    }

    setError(null);
    setBuildStatus('building');
    setProgress(5);
    setProgressMessage('Generating AI navigation script...');

    try {
      const result = await generateScriptAction(appState.webUrl);

      if (result.success && result.data) {
        dispatch({ type: 'UPDATE_FIELD', field: 'dpadScript', value: result.data.javaScriptSnippet });
        dispatch({ type: 'UPDATE_FIELD', field: 'dpadScriptExplanation', value: result.data.explanation });

        for (const step of buildProcessSteps) {
          await new Promise(resolve => setTimeout(resolve, 700));
          setProgress(step.progress);
          setProgressMessage(step.message);
        }
        setBuildStatus('completed');
      } else {
        setError(result.message);
        setBuildStatus('error');
      }
    } catch (e) {
        setError("An unexpected error occurred during script generation.");
        setBuildStatus('error');
    }
  };

  const handleReset = () => {
    setBuildStatus('idle');
    setProgress(0);
    setProgressMessage('');
    setError(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build & Download</CardTitle>
        <CardDescription>
          Generate your Fire TV APK file. The build process will automatically include an AI-generated D-Pad navigation script.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {buildStatus === 'idle' && (
           <div className="text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
            Click "Build APK" to start the compilation process.
          </div>
        )}
        {buildStatus === 'building' && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">{progressMessage}</p>
          </div>
        )}
         {buildStatus === 'completed' && (
          <Alert className="border-green-500/50 text-green-500 [&>svg]:text-green-500">
            <Rocket className="h-4 w-4" />
            <AlertTitle>Build Complete!</AlertTitle>
            <AlertDescription>
              Your APK is ready for download.
            </AlertDescription>
          </Alert>
        )}
         {buildStatus === 'error' && error && (
          <Alert variant="destructive">
            <Rocket className="h-4 w-4" />
            <AlertTitle>Build Failed</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {buildStatus === 'idle' || buildStatus === 'error' ? (
          <Button onClick={handleBuild} disabled={!appState.webUrl || !appState.projectTitle}>
            Build APK
            <Rocket className="ml-2 h-4 w-4" />
          </Button>
        ) : buildStatus === 'building' ? (
          <Button disabled>
            Building...
          </Button>
        ) : (
          <>
          <Button asChild>
            <a href="/#" onClick={(e) => e.preventDefault()}>
              Download APK
              <Download className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" onClick={handleReset}>
              Start New Build
          </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}