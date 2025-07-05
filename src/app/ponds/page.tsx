
"use client";
import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { useFarmData, type Pond } from "@/contexts/FarmDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const pondSchema = z.object({
  name: z.string().min(1, "Nama kolam harus diisi"),
  area: z.coerce.number().min(1, "Luas area harus lebih dari 0"),
  fishCount: z.coerce.number().min(0, "Jumlah ikan tidak boleh negatif"),
  status: z.enum(["Aktif", "Tidak Aktif", "Perawatan"]),
});

function PondForm({ pond, onFormSubmit }: { pond?: Pond, onFormSubmit: (values: z.infer<typeof pondSchema>) => void }) {
  const form = useForm<z.infer<typeof pondSchema>>({
    resolver: zodResolver(pondSchema),
    defaultValues: pond || {
      name: "",
      area: 0,
      fishCount: 0,
      status: "Tidak Aktif",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kolam</FormLabel>
              <FormControl><Input placeholder="Contoh: Kolam A1" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Luas (m²)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fishCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Ikan</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Pilih status kolam" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                  <SelectItem value="Perawatan">Perawatan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function PondRowActions({ pond }: { pond: Pond }) {
  const { deletePond, updatePond } = useFarmData();
  const { toast } = useToast();
  const [isEditOpen, setEditOpen] = React.useState(false);

  const handleUpdate = (values: z.infer<typeof pondSchema>) => {
    updatePond({ ...pond, ...values });
    toast({ title: "Sukses", description: "Data kolam berhasil diperbarui." });
    setEditOpen(false);
  }
  
  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Kolam</DialogTitle>
                <DialogDescription>Perbarui informasi untuk kolam {pond.name}.</DialogDescription>
            </DialogHeader>
            <PondForm pond={pond} onFormSubmit={handleUpdate} />
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => deletePond(pond.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Hapus</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

function PondsPageContent() {
  const { ponds, addPond } = useFarmData();
  const { toast } = useToast();
  const [isAddOpen, setAddOpen] = React.useState(false);

  const handleAdd = (values: z.infer<typeof pondSchema>) => {
    addPond(values);
    toast({ title: "Sukses", description: "Kolam baru berhasil ditambahkan." });
    setAddOpen(false);
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Kolam
          </h1>
          <p className="text-muted-foreground mt-1">
            Lihat, tambah, dan kelola semua kolam Anda di satu tempat.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Tambah Kolam
            </Button>
          </DialogTrigger>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Tambah Kolam Baru</DialogTitle>
                  <DialogDescription>Masukkan detail untuk kolam baru Anda.</DialogDescription>
              </DialogHeader>
              <PondForm onFormSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kolam</CardTitle>
          <CardDescription>Total {ponds.length} kolam terdaftar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kolam</TableHead>
                <TableHead className="text-center">Luas (m²)</TableHead>
                <TableHead className="text-center">Jumlah Ikan</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ponds.length > 0 ? ponds.map(pond => (
                <TableRow key={pond.id}>
                  <TableCell className="font-medium">{pond.name}</TableCell>
                  <TableCell className="text-center">{pond.area}</TableCell>
                  <TableCell className="text-center">{pond.fishCount.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={pond.status === 'Aktif' ? 'default' : 'secondary'} className={pond.status === 'Aktif' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'}>{pond.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <PondRowActions pond={pond} />
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Belum ada data kolam.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

export default function PondsPage() {
  return (
      <AppShell>
          <PondsPageContent />
      </AppShell>
  );
}
