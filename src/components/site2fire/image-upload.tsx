'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import Image from 'next/image';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLogo } from '../app-logo';

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  width: number;
  height: number;
}

export function ImageUpload({ value, onChange, width, height }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const resizeImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Use a smaller target size for icons in prototypes to guarantee small file size
        // 256x256 is standard for many TV icon assets and stays well under Firestore limits
        const targetWidth = 256;
        const targetHeight = 256;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          
          // Use low-quality JPEG to ensure tiny base64 strings
          resolve(canvas.toDataURL('image/jpeg', 0.4));
        } else {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        try {
          const compressed = await resizeImage(result);
          setPreviewUrl(compressed);
          onChange(compressed);
        } catch (error) {
          console.error("Failed to process image:", error);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full max-w-[256px] aspect-square">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        <div
          className={`relative group border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors w-full h-full ${isProcessing ? 'bg-muted/50 cursor-wait' : ''}`}
          onClick={triggerFileInput}
        >
          {previewUrl && !isProcessing ? (
            <>
              <Image
                src={previewUrl}
                alt="App icon preview"
                fill
                className="object-cover rounded-md"
                priority
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground z-10 p-4 text-center">
                {isProcessing ? (
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                ) : (
                  <Upload className="h-12 w-12 text-muted-foreground/30" />
                )}
                <span className="text-sm font-medium">
                  {isProcessing ? 'Optimizing Icon...' : 'Upload App Icon'}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  Auto-compressed for Fire TV
                </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
