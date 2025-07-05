import { AppShell } from "@/components/app-shell";
import { CareTipsGenerator } from "@/components/dashboard/care-tips-generator";
import { CultivationCalendarCard } from "@/components/dashboard/cultivation-calendar-card";
import { GrowthChartCard } from "@/components/dashboard/growth-chart-card";
import { FinanceSummaryCard, FeedSummaryCard, PondSummaryCard } from "@/components/dashboard/summary-cards";

export default function Home() {
  return (
    <AppShell>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang kembali! Berikut ringkasan peternakan lele Anda.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <PondSummaryCard />
          <FeedSummaryCard />
          <FinanceSummaryCard />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <GrowthChartCard className="xl:col-span-2" />
          <CultivationCalendarCard />
        </div>
        
        <div className="mt-6">
          <CareTipsGenerator />
        </div>
      </main>
    </AppShell>
  );
}
