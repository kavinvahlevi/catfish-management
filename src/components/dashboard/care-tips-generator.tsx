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
import { Loader2, Sparkles } from "lucide-react";
import { getCareTipsAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  pondCount: z.coerce.number().min(1, "Jumlah kolam harus diisi"),
  pondArea: z.coerce.number().min(1, "Luas kolam harus diisi"),
  catfishType: z.string().min(1, "Jenis lele harus diisi"),
  stockingDensity: z.coerce.number().min(1, "Kepadatan tebar harus diisi"),
  feedType: z.string().min(1, "Jenis pakan harus diisi"),
  waterSource: z.string().min(1, "Sumber air harus diisi"),
  diseaseHistory: z.string().optional(),
  currentHealthStatus: z.string().min(1, "Status kesehatan harus diisi"),
});

export function CareTipsGenerator({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [careTips, setCareTips] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary w-6 h-6" />
          Tips Perawatan Berbasis AI
        </CardTitle>
        <CardDescription>
          Masukkan data peternakan Anda untuk mendapatkan rekomendasi perawatan kolam dan pencegahan penyakit yang dipersonalisasi.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="pondCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Kolam</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Contoh: 12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pondArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Luas (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Contoh: 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="catfishType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Lele</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Lele Sangkuriang" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stockingDensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kepadatan (ekor/m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Contoh: 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Pakan</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Pelet protein 30%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="waterSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sumber Air</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Air sumur bor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="currentHealthStatus"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Status Kesehatan Saat Ini</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Sehat dan nafsu makan baik" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="diseaseHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Riwayat Penyakit (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Jelaskan riwayat penyakit jika ada..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            {loading && (
              <div className="flex items-center justify-center p-8 bg-muted rounded-md">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <p>AI sedang menganalisis data Anda...</p>
              </div>
            )}

            {careTips && !loading && (
              <Alert className="bg-accent/50 border-primary/50">
                <Sparkles className="h-4 w-4 !text-primary" />
                <AlertTitle className="text-primary font-semibold">Rekomendasi Perawatan</AlertTitle>
                <AlertDescription className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {careTips}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses
                </>
              ) : (
                "Hasilkan Tips Perawatan"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
