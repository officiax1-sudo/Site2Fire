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
import { Rocket, Loader2, Sparkles, Download, CheckCircle2, ArrowRight, Info, Code, BookOpen, AlertCircle, FileText } from 'lucide-react';
import { useAppForm } from '@/app/form-context';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { generateScriptAction } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BuildCard() {
  const { state: appState, dispatch } = useAppForm();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastBuildUrl, setLastBuildUrl] = useState<string | null>(null);

  const handleBuild = async () => {
    setError(null);
    setLastBuildUrl(null);
    
    if (!user) {
      setError("You must sign in to create a build.");
      return;
    }
    if (!firestore) {
      setError("Cloud services are initializing. Please wait a moment.");
      return;
    }

    // Safety check for Icon size (Firestore limit is 1MB total per doc)
    if (appState.appIcon && appState.appIcon.length > 800000) {
      setError("The App Icon is too large. Please re-upload it to allow the automatic optimizer to compress it correctly.");
      return;
    }

    const urlSchema = z.string().url();
    if (!appState.projectTitle) {
      setError("An App Title is required to generate the APK.");
      return;
    }
    if (!urlSchema.safeParse(appState.webUrl).success) {
      setError("A valid Web URL is required to start the conversion.");
      return;
    }

    setIsBuilding(true);

    try {
      setBuildStep("Analyzing URL & Generating AI Navigation...");
      const aiResult = await generateScriptAction(appState.webUrl);

      if (!aiResult.success || !aiResult.data) {
        throw new Error(aiResult.message || "Failed to generate AI script.");
      }

      dispatch({ type: 'UPDATE_FIELD', field: 'dpadScript', value: aiResult.data.javaScriptSnippet });
      dispatch({ type: 'UPDATE_FIELD', field: 'dpadScriptExplanation', value: aiResult.data.explanation });

      setBuildStep("Compiling Fire TV APK Package...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      const buildsCollection = collection(firestore, `users/${user.uid}/builds`);
      
      const dummyContent = btoa("Site2Fire Mock APK Content for " + appState.projectTitle);
      const simulatedApkUrl = `data:application/vnd.android.package-archive;base64,${dummyContent}`;
      
      const buildData = {
        ...appState,
        dpadScript: aiResult.data.javaScriptSnippet,
        dpadScriptExplanation: aiResult.data.explanation,
        createdAt: serverTimestamp(),
        apkUrl: simulatedApkUrl,
        status: 'completed',
        ownerId: user.uid,
      };

      await addDoc(buildsCollection, buildData);

      setLastBuildUrl(simulatedApkUrl);
      
      toast({
        title: "Build Successful",
        description: "Your Fire TV APK is ready for download.",
      });
      
    } catch (e: any) {
      let msg = e.message || "Failed to start build.";
      if (msg.includes("longer than 1048487 bytes")) {
        msg = "The App Icon is still too large. Please remove and re-upload the icon to trigger the optimizer.";
      }
      setError(msg);
    } finally {
      setIsBuilding(false);
      setBuildStep(null);
    }
  };

  if (lastBuildUrl) {
    const fileName = `${appState.projectTitle.toLowerCase().replace(/\s+/g, '-')}-v${appState.versionName || '1.0'}.apk`;
    
    return (
      <Card className="border-green-500/50 shadow-lg bg-green-50/5 dark:bg-green-950/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Build Complete!</CardTitle>
          <CardDescription>
            Your configuration for "{appState.projectTitle}" has been generated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="apk" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="apk">Download</TabsTrigger>
              <TabsTrigger value="ai">AI Results</TabsTrigger>
            </TabsList>
            <TabsContent value="apk" className="space-y-4 pt-4">
              <div className="bg-muted p-4 rounded-lg border text-sm font-mono break-all text-center">
                {fileName}
              </div>
              <Alert className="bg-blue-50/10 border-blue-500/30">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-[11px] leading-relaxed text-blue-300">
                  This download is a <strong>Mock APK</strong> for testing your dashboard workflow. To build the real native app, use the Gemini prompt in your documentation.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="ai" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="h-4 w-4 text-primary" />
                  AI Explanation
                </div>
                <ScrollArea className="h-[100px] w-full rounded-md border p-2 bg-muted/30">
                  <p className="text-xs text-muted-foreground">{appState.dpadScriptExplanation}</p>
                </ScrollArea>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Code className="h-4 w-4 text-primary" />
                  Generated JS
                </div>
                <ScrollArea className="h-[100px] w-full rounded-md border p-2 bg-black/80 font-mono text-[10px] text-green-400">
                  <pre>{appState.dpadScript}</pre>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700">
            <a href={lastBuildUrl} download={fileName}>
              <Download className="mr-2 h-4 w-4" />
              Download Mock APK
            </a>
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" size="sm" asChild>
                <Link href="/builds">
                    <FileText className="mr-2 h-3 w-3" />
                    History
                </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLastBuildUrl(null)}>
                New Build
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-primary/50 shadow-lg">
      <CardHeader className="text-center md:text-left">
        <CardTitle>Build TV APK</CardTitle>
        <CardDescription>
          Generate a sideload-ready APK optimized for Fire Stick and Android TV devices.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Build Failed</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {isBuilding && buildStep && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 bg-primary/10 rounded-lg text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
            <div className="flex items-center gap-2 animate-pulse">
              <Sparkles className="h-4 w-4" />
              <span className="text-base font-medium">{buildStep}</span>
            </div>
          </div>
        )}

         {!isBuilding && (
           <div className="text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border border-dashed">
            The process includes AI-powered D-Pad optimization using Gemini 2.5 Flash.
          </div>
         )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleBuild} 
          disabled={isBuilding || !appState.webUrl || !appState.projectTitle}
          size="lg"
          className="w-full"
        >
            {isBuilding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Build...
              </>
            ) : (
              <>
                Build Fire TV APK
                <Rocket className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
      </CardFooter>
    </Card>
  );
}
