import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, ListTodo, Wallet } from "lucide-react";

export function PondSummaryCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Kolam Aktif</CardTitle>
        <Droplets className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12</div>
        <p className="text-xs text-muted-foreground">Total luas 1,200 m²</p>
      </CardContent>
    </Card>
  );
}

export function FeedSummaryCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Jadwal Pakan</CardTitle>
        <ListTodo className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">08:00 & 17:00</div>
        <p className="text-xs text-muted-foreground">Jadwal harian</p>
      </CardContent>
    </Card>
  );
}

export function FinanceSummaryCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Keuangan Bulan Ini</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">+Rp 5.250.000</div>
        <p className="text-xs text-muted-foreground">Estimasi keuntungan bersih</p>
      </CardContent>
    </Card>
  );
}
