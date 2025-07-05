
import { AppShell } from "@/components/app-shell";
import { CultivationCalendarCard } from "@/components/dashboard/cultivation-calendar-card";
import { GrowthChartCard } from "@/components/dashboard/growth-chart-card";
import { FinanceSummaryCard, FeedSummaryCard, PondSummaryCard } from "@/components/dashboard/summary-cards";
import { FarmDataProvider } from "@/contexts/FarmDataContext";
import { CatfishDiagnosisCard } from "@/components/dashboard/catfish-diagnosis-card";
import { TipsTeaserCard } from "@/components/dashboard/tips-teaser-card";

export default function Home() {
  return (
    <AppShell>
      <FarmDataProvider>
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
            <CatfishDiagnosisCard />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            <CultivationCalendarCard className="md:col-span-2" />
            <TipsTeaserCard />
          </div>
        </main>
      </FarmDataProvider>
    </AppShell>
  );
}
