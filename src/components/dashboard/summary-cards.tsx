
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, ListTodo, Wallet } from "lucide-react";
import { useFarmData } from "@/contexts/FarmDataContext";

function formatCurrency(value: number, currency: string = 'IDR') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(value);
}

export function PondSummaryCard() {
  const { ponds } = useFarmData();
  const activePonds = ponds.filter(p => p.status === 'Aktif');
  const totalArea = activePonds.reduce((sum, p) => sum + p.area, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Kolam Aktif</CardTitle>
        <Droplets className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activePonds.length}</div>
        <p className="text-xs text-muted-foreground">Total luas {totalArea.toLocaleString('id-ID')} m²</p>
      </CardContent>
    </Card>
  );
}

export function FeedSummaryCard() {
  const { feedingSchedules } = useFarmData();
  const scheduleText = feedingSchedules.map(s => s.time).join(' & ') || 'Belum diatur';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Jadwal Pakan</CardTitle>
        <ListTodo className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{scheduleText}</div>
        <p className="text-xs text-muted-foreground">Jadwal pemberian pakan harian</p>
      </CardContent>
    </Card>
  );
}

export function FinanceSummaryCard() {
  const { transactions } = useFarmData();
  const monthlyProfit = transactions.reduce((sum, t) => {
    return t.type === 'Pemasukan' ? sum + t.amount : sum - t.amount;
  }, 0);

  const formattedProfit = formatCurrency(monthlyProfit);
  const isProfit = monthlyProfit >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Keuangan Bulan Ini</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}{formattedProfit}
        </div>
        <p className="text-xs text-muted-foreground">Estimasi keuntungan bersih</p>
      </CardContent>
    </Card>
  );
}
