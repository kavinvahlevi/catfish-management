'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Fish, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { diagnoseCatfishAction } from '@/app/actions';
import type { DiagnoseCatfishOutput } from '@/ai/flows/diagnose-catfish-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function CatfishDiagnosisCard({ className }: { className?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseCatfishOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setResult(null);
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file || !preview) {
        toast({
            variant: "destructive",
            title: "Tidak ada file",
            description: "Silakan pilih file gambar untuk didiagnosis.",
        });
        return;
    }
    setLoading(true);
    setResult(null);
    try {
        const diagnosisResult = await diagnoseCatfishAction({ photoDataUri: preview });
        if (diagnosisResult) {
            setResult(diagnosisResult);
        } else {
            throw new Error('Gagal mendapatkan respons dari AI.');
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Terjadi Kesalahan",
            description: "Tidak dapat memproses gambar. Silakan coba lagi.",
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="text-primary w-6 h-6" />
          Diagnosa Kesehatan Lele
        </CardTitle>
        <CardDescription>
          Unggah foto lele untuk mendapatkan diagnosa dan rekomendasi dari AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
            <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
            <p className="text-xs text-muted-foreground">Pilih gambar lele yang ingin diperiksa.</p>
        </div>
        {preview && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border">
            <Image
              src={preview}
              alt="Pratinjau Lele"
              layout="fill"
              objectFit="contain"
              data-ai-hint="catfish"
            />
          </div>
        )}
        {loading && (
            <div className="flex items-center justify-center p-8 bg-muted rounded-md">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <p>AI sedang menganalisis foto...</p>
            </div>
        )}
        {result && !loading && (
             <Alert variant={result.isCatfish && result.disease === 'Sehat' ? 'default' : 'destructive'} className={result.isCatfish && result.disease === 'Sehat' ? "bg-accent/50 border-primary/50" : ""}>
                {result.isCatfish && result.disease === 'Sehat' ? <Sparkles className="h-4 w-4 !text-primary" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle className={result.isCatfish && result.disease === 'Sehat' ? "text-primary font-semibold" : ""}>
                    {result.isCatfish ? `Hasil Diagnosa: ${result.disease}` : 'Gambar Tidak Dikenali'}
                </AlertTitle>
                <AlertDescription className="prose prose-sm max-w-none text-foreground space-y-2">
                    <p><strong>Ringkasan:</strong> {result.diagnosis}</p>
                    <p><strong>Rekomendasi:</strong> {result.recommendation}</p>
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading || !file}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mendiagnosa...
            </>
          ) : (
            <>
              <Fish className="mr-2 h-4 w-4" />
              Diagnosa Sekarang
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
