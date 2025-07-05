"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, PencilLine, FileText } from "lucide-react";
import { getCareTipsAction, generateTipsFromPromptAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schema for the structured form
const structuredFormSchema = z.object({
  pondCount: z.coerce.number().min(1, "Jumlah kolam harus diisi"),
  pondArea: z.coerce.number().min(1, "Luas kolam harus diisi"),
  catfishType: z.string().min(1, "Jenis lele harus diisi"),
  stockingDensity: z.coerce.number().min(1, "Kepadatan tebar harus diisi"),
  feedType: z.string().min(1, "Jenis pakan harus diisi"),
  waterSource: z.string().min(1, "Sumber air harus diisi"),
  diseaseHistory: z.string().optional(),
  currentHealthStatus: z.string().min(1, "Status kesehatan harus diisi"),
});

// Schema for the prompt form
const promptFormSchema = z.object({
  prompt: z.string().min(10, "Pertanyaan harus diisi, minimal 10 karakter."),
});

export function CareTipsGenerator({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [careTips, setCareTips] = useState("");
  const { toast } = useToast();

  const structuredForm = useForm<z.infer<typeof structuredFormSchema>>({
    resolver: zodResolver(structuredFormSchema),
    defaultValues: {
      pondCount: 10,
      pondArea: 100,
      catfishType: "Lele Sangkuriang",
      stockingDensity: 150,
      feedType: "Pelet apung protein 30%",
      waterSource: "Air sumur bor",
      diseaseHistory: "Infeksi jamur ringan bulan lalu",
      currentHealthStatus: "Sehat dan aktif",
    },
  });

  const promptForm = useForm<z.infer<typeof promptFormSchema>>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onStructuredSubmit(values: z.infer<typeof structuredFormSchema>) {
    setLoading(true);
    setCareTips("");
    try {
      const result = await getCareTipsAction({
        ...values,
        diseaseHistory: values.diseaseHistory || "Tidak ada riwayat penyakit signifikan",
      });
      if (result && result.careTips) {
        setCareTips(result.careTips);
      } else {
        throw new Error("Gagal mendapatkan respons dari AI.");
      }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Terjadi Kesalahan",
            description: "Tidak dapat menghasilkan tips. Silakan coba lagi.",
        });
    } finally {
      setLoading(false);
    }
  }

  async function onPromptSubmit(values: z.infer<typeof promptFormSchema>) {
    setLoading(true);
    setCareTips("");
    try {
      const result = await generateTipsFromPromptAction(values);
      if (result && result.careTips) {
        setCareTips(result.careTips);
      } else {
        throw new Error("Gagal mendapatkan respons dari AI.");
      }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Terjadi Kesalahan",
            description: "Tidak dapat menghasilkan tips. Silakan coba lagi.",
        });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary w-6 h-6" />
          Tips Perawatan Berbasis AI
        </CardTitle>
        <CardDescription>
          Pilih metode input: isi form detail atau ajukan pertanyaan langsung untuk mendapatkan rekomendasi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="structured" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="structured"><FileText className="mr-2"/>Data Terstruktur</TabsTrigger>
            <TabsTrigger value="prompt"><PencilLine className="mr-2"/>Pertanyaan Bebas</TabsTrigger>
          </TabsList>
          
          {/* Structured Data Form Tab */}
          <TabsContent value="structured">
            <Form {...structuredForm}>
              <form onSubmit={structuredForm.handleSubmit(onStructuredSubmit)}>
                <CardContent className="space-y-6 pt-6 px-1">
                  <p className="text-sm text-muted-foreground">Isi data peternakan Anda untuk mendapatkan rekomendasi perawatan kolam dan pencegahan penyakit yang dipersonalisasi.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={structuredForm.control} name="pondCount" render={({ field }) => (<FormItem><FormLabel>Jumlah Kolam</FormLabel><FormControl><Input type="number" placeholder="Contoh: 12" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={structuredForm.control} name="pondArea" render={({ field }) => (<FormItem><FormLabel>Total Luas (m²)</FormLabel><FormControl><Input type="number" placeholder="Contoh: 500" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={structuredForm.control} name="catfishType" render={({ field }) => (<FormItem><FormLabel>Jenis Lele</FormLabel><FormControl><Input placeholder="Contoh: Lele Sangkuriang" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={structuredForm.control} name="stockingDensity" render={({ field }) => (<FormItem><FormLabel>Kepadatan (ekor/m²)</FormLabel><FormControl><Input type="number" placeholder="Contoh: 150" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={structuredForm.control} name="feedType" render={({ field }) => (<FormItem><FormLabel>Jenis Pakan</FormLabel><FormControl><Input placeholder="Contoh: Pelet protein 30%" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={structuredForm.control} name="waterSource" render={({ field }) => (<FormItem><FormLabel>Sumber Air</FormLabel><FormControl><Input placeholder="Contoh: Air sumur bor" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={structuredForm.control} name="currentHealthStatus" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Status Kesehatan Saat Ini</FormLabel><FormControl><Input placeholder="Contoh: Sehat dan nafsu makan baik" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={structuredForm.control} name="diseaseHistory" render={({ field }) => (<FormItem><FormLabel>Riwayat Penyakit (Opsional)</FormLabel><FormControl><Textarea placeholder="Jelaskan riwayat penyakit jika ada..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
                <CardFooter className="px-1">
                  <Button type="submit" disabled={loading}>
                    {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses</>) : "Hasilkan Tips dari Data"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>

          {/* Free-form Prompt Tab */}
          <TabsContent value="prompt">
             <Form {...promptForm}>
              <form onSubmit={promptForm.handleSubmit(onPromptSubmit)}>
                <CardContent className="space-y-6 pt-6 px-1">
                  <p className="text-sm text-muted-foreground">Ajukan pertanyaan spesifik tentang budidaya lele, misalnya tentang cara mengatasi penyakit tertentu, manajemen pakan, atau kualitas air.</p>
                  <FormField control={promptForm.control} name="prompt" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pertanyaan Anda</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Contoh: Bagaimana cara mengatasi air kolam yang berbau busuk dan berwarna hijau pekat?" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
                <CardFooter className="px-1">
                  <Button type="submit" disabled={loading}>
                    {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses</>) : "Dapatkan Jawaban"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {loading && (
          <div className="flex items-center justify-center p-8 mt-6 bg-muted rounded-md">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <p>AI sedang menganalisis data Anda...</p>
          </div>
        )}

        {careTips && !loading && (
          <Alert className="mt-6 bg-accent/50 border-primary/50">
            <Sparkles className="h-4 w-4 !text-primary" />
            <AlertTitle className="text-primary font-semibold">Rekomendasi AI</AlertTitle>
            <AlertDescription className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {careTips}
            </AlertDescription>
          </Alert>
        )}

      </CardContent>
    </Card>
  );
}
