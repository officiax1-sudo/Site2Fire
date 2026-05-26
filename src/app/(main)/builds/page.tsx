'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download, ArrowRight, Package, ExternalLink, Code } from "lucide-react";
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BuildsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const buildsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/builds`), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: builds, isLoading } = useCollection(buildsQuery);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!builds || builds.length === 0) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-border rounded-lg p-12 mt-8">
            <div className="bg-muted rounded-full p-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-primary-foreground">
              No Builds Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create a new project to see your builds here.
            </p>
             <Button asChild>
                <Link href="/">
                    Create New Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">My Builds</h1>
         <Button asChild variant="outline">
            <Link href="/">
              New Project
            </Link>
         </Button>
       </div>
       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {builds.map((build: any) => {
          const fileName = `${build.projectTitle.toLowerCase().replace(/\s+/g, '-')}-v${build.versionName || '1.0'}.apk`;
          const createdDate = build.createdAt?.toDate ? build.createdAt.toDate() : null;
          
          return (
            <Card key={build.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="truncate max-w-[180px]">{build.projectTitle}</CardTitle>
                    <CardDescription>Version {build.versionName}</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="View AI Script">
                        <Code className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>AI Navigation Optimization</DialogTitle>
                        <DialogDescription>
                          Generated script for {build.webUrl}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Optimization Explanation</h4>
                          <ScrollArea className="h-32 rounded-md border p-4 bg-muted/50">
                            <p className="text-xs text-muted-foreground">{build.dpadScriptExplanation}</p>
                          </ScrollArea>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Injection Script</h4>
                          <ScrollArea className="h-48 rounded-md border p-4 bg-black/90 font-mono text-[11px] text-green-400">
                            <pre>{build.dpadScript}</pre>
                          </ScrollArea>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {createdDate ? format(createdDate, 'PPp') : 'Pending...'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Package</span>
                  <Badge variant="outline" className="truncate max-w-[150px]">{build.packageName}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Target URL</span>
                  <Link 
                    href={build.webUrl} 
                    target="_blank" 
                    className="font-medium text-primary hover:underline flex items-center gap-1 truncate max-w-[150px]"
                  >
                    {build.webUrl}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href={build.apkUrl} download={fileName}>
                    <Download className="mr-2 h-4 w-4" />
                    Download APK
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
       </div>
    </div>
  );
}
