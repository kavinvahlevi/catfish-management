
"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFarmData, type CalendarEvent } from "@/contexts/FarmDataContext";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { PlusCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Judul acara harus diisi."),
  description: z.string().optional(),
});

export default function CalendarPage() {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent } = useFarmData();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isAddOpen, setAddOpen] = React.useState(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: "", description: "" },
  });

  const selectedDayEvents = React.useMemo(() => {
    if (!selectedDate) return [];
    return calendarEvents.filter(event => isSameDay(event.date, selectedDate));
  }, [selectedDate, calendarEvents]);

  const eventDays = React.useMemo(() => {
    return calendarEvents.map(event => event.date);
  }, [calendarEvents]);

  const handleAddEvent = (values: z.infer<typeof eventSchema>) => {
    if (!selectedDate) {
      toast({ variant: "destructive", title: "Tanggal belum dipilih", description: "Silakan pilih tanggal terlebih dahulu." });
      return;
    }
    addCalendarEvent({ ...values, date: selectedDate });
    toast({ title: "Sukses", description: "Acara baru telah ditambahkan ke kalender." });
    setAddOpen(false);
    form.reset();
  };
  
  return (
    <AppShell>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1">
          Kalender Budidaya
        </h1>
        <p className="text-muted-foreground mb-6">
          Kelola jadwal dan agenda penting dalam siklus budidaya Anda.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-2 md:p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ events: eventDays }}
                modifiersClassNames={{
                  events: 'bg-primary/20 text-primary-foreground rounded-full',
                }}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agenda untuk {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: id }) : '...'}</CardTitle>
              <CardDescription>Acara dan tugas yang dijadwalkan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(event => (
                  <div key={event.id} className="flex items-start justify-between p-3 rounded-md bg-accent/50">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCalendarEvent(event.id, event.date)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Tidak ada acara untuk tanggal ini.</p>
              )}
              
              <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={!selectedDate}>
                    <PlusCircle className="mr-2" />
                    Tambah Acara
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Acara Baru</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddEvent)} className="space-y-4">
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Judul Acara</FormLabel>
                          <FormControl><Input {...field} placeholder="Contoh: Panen Kolam B2" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi (Opsional)</FormLabel>
                          <FormControl><Textarea {...field} placeholder="Catatan tambahan..." /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
                        <Button type="submit">Simpan</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
