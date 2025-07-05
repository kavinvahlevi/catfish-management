
"use client";

import { AppShell } from "@/components/app-shell";
import { useFarmData, type FeedingSchedule } from "@/contexts/FarmDataContext";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  schedules: z.array(z.object({
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid (HH:MM)"),
    feedAmount: z.coerce.number().min(0, "Jumlah pakan tidak boleh negatif"),
  })),
});

function FeedingSchedulePageContent() {
  const { feedingSchedules, updateFeedingSchedule } = useFarmData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedules: feedingSchedules,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateFeedingSchedule(values.schedules);
    toast({
      title: "Jadwal Disimpan",
      description: "Jadwal pemberian pakan telah berhasil diperbarui.",
    });
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Jadwal Pakan
          </h1>
          <p className="text-muted-foreground mt-1">
            Atur waktu dan jumlah pemberian pakan harian untuk semua kolam.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock /> Jadwal Harian</CardTitle>
            <CardDescription>Tambahkan, hapus, atau ubah jadwal pemberian pakan di bawah ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4">
                      <FormField
                        control={form.control}
                        name={`schedules.${index}.time`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Waktu (HH:MM)</FormLabel>
                            <FormControl><Input type="time" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schedules.${index}.feedAmount`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Jumlah Pakan (kg)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ time: "12:00", feedAmount: 5 })}
                  >
                    <PlusCircle className="mr-2" />
                    Tambah Jadwal
                  </Button>
                  <Button type="submit">Simpan Perubahan</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function FeedingSchedulePage() {
    return (
        <AppShell>
            <FeedingSchedulePageContent />
        </AppShell>
    );
}
