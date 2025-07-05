
"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { useFarmData, type GrowthRecord } from "@/contexts/FarmDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const chartConfig = {
  weight: {
    label: "Berat (g)",
    color: "hsl(var(--primary))",
  },
};

const growthRecordSchema = z.object({
  date: z.date({ required_error: "Tanggal harus diisi." }),
  averageWeight: z.coerce.number().min(1, "Berat rata-rata harus lebih dari 0."),
  notes: z.string().optional(),
});

export default function GrowthMonitoringPage() {
  const { growthRecords, addGrowthRecord, deleteGrowthRecord } = useFarmData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof growthRecordSchema>>({
    resolver: zodResolver(growthRecordSchema),
    defaultValues: {
      date: new Date(),
      averageWeight: 0,
      notes: "",
    },
  });

  const chartData = growthRecords.map(record => ({
    date: format(record.date, 'dd MMM yyyy'),
    weight: record.averageWeight,
  }));

  function onSubmit(values: z.infer<typeof growthRecordSchema>) {
    addGrowthRecord(values);
    toast({ title: "Sukses", description: "Data pertumbuhan baru berhasil ditambahkan." });
    form.reset();
  }

  return (
    <AppShell>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1">
          Monitoring Pertumbuhan
        </h1>
        <p className="text-muted-foreground mb-6">
          Pantau dan catat pertumbuhan berat rata-rata lele Anda.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Grafik Pertumbuhan Lele</CardTitle>
                <CardDescription>Visualisasi data berat rata-rata (gram) dari waktu ke waktu.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 20', 'dataMax + 20']}/>
                    <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Line dataKey="weight" type="monotone" stroke="var(--color-weight)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tambah Catatan Baru</CardTitle>
                <CardDescription>Masukkan data sampling terbaru.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Sampling</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                  {field.value ? format(field.value, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="averageWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Berat Rata-rata (gram)</FormLabel>
                          <FormControl><Input type="number" placeholder="Contoh: 150" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catatan (Opsional)</FormLabel>
                          <FormControl><Textarea placeholder="Contoh: Ikan sehat, nafsu makan tinggi" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      <PlusCircle className="mr-2" />
                      Simpan Data
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Riwayat Data Pertumbuhan</CardTitle>
            <CardDescription>Semua data pertumbuhan yang pernah Anda catat.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Berat Rata-rata (g)</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...growthRecords].reverse().map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(record.date, "dd MMMM yyyy", { locale: id })}</TableCell>
                    <TableCell className="text-right font-medium">{record.averageWeight}</TableCell>
                    <TableCell className="text-muted-foreground">{record.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteGrowthRecord(record.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
