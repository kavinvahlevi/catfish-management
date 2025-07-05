
import { AppShell } from "@/components/app-shell";
import { CareTipsGenerator } from "@/components/dashboard/care-tips-generator";
import { FarmDataProvider } from "@/contexts/FarmDataContext";

export default function TipsPage() {
  return (
    <AppShell>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Tips Budidaya
            </h1>
            <p className="text-muted-foreground mt-1">
            Dapatkan rekomendasi cerdas dari AI untuk mengoptimalkan peternakan Anda.
            </p>
        </div>
        <FarmDataProvider>
            <CareTipsGenerator />
        </FarmDataProvider>
      </main>
    </AppShell>
  );
}
