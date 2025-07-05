
"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { useFarmData, type Transaction } from "@/contexts/FarmDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const transactionSchema = z.object({
  description: z.string().min(1, "Deskripsi harus diisi."),
  amount: z.coerce.number().min(1, "Jumlah harus lebih dari 0."),
  type: z.enum(["Pemasukan", "Pengeluaran"], { required_error: "Jenis transaksi harus dipilih." }),
  date: z.date(),
});

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function AddTransactionForm({ onFormSubmit }: { onFormSubmit: (values: z.infer<typeof transactionSchema>) => void }) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Jenis Transaksi</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="Pemasukan" /></FormControl>
                    <FormLabel className="font-normal">Pemasukan</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="Pengeluaran" /></FormControl>
                    <FormLabel className="font-normal">Pengeluaran</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl><Textarea placeholder="Contoh: Penjualan hasil panen" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah (Rp)</FormLabel>
              <FormControl><Input type="number" placeholder="Contoh: 5000000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
          <Button type="submit">Simpan Transaksi</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function FinancePageContent() {
  const { transactions, addTransaction, deleteTransaction } = useFarmData();
  const { toast } = useToast();
  const [isAddOpen, setAddOpen] = React.useState(false);
  
  const totalIncome = transactions.filter(t => t.type === 'Pemasukan').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Pengeluaran').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const sortedTransactions = React.useMemo(() => {
    return [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions]);

  const handleAddTransaction = (values: z.infer<typeof transactionSchema>) => {
    addTransaction(values);
    toast({ title: "Sukses", description: "Transaksi baru berhasil ditambahkan." });
    setAddOpen(false);
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Catatan Keuangan
          </h1>
          <p className="text-muted-foreground mt-1">
            Lacak semua pemasukan dan pengeluaran budidaya lele Anda.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2" /> Tambah Transaksi</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Transaksi Baru</DialogTitle>
              <DialogDescription>Catat pemasukan atau pengeluaran baru.</DialogDescription>
            </DialogHeader>
            <AddTransactionForm onFormSubmit={handleAddTransaction} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
                  <ArrowDownCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                  <ArrowUpCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Keuntungan Bersih</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(netProfit)}</div>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>Daftar semua transaksi yang telah dicatat.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-center">Jenis</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length > 0 ? sortedTransactions.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{format(t.date, "dd MMM yyyy", { locale: id })}</TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={t.type === 'Pemasukan' ? 'default' : 'destructive'} className={t.type === 'Pemasukan' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${t.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteTransaction(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Belum ada transaksi.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

export default function FinancePage() {
    return (
        <AppShell>
            <FinancePageContent />
        </AppShell>
    );
}
