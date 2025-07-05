import { AppShell } from "@/components/app-shell";

export default function FinancePage() {
  return (
    <AppShell>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Catatan Keuangan
        </h1>
        <p className="text-muted-foreground mt-1">
          Halaman ini sedang dalam pengembangan.
        </p>
      </main>
    </AppShell>
  );
}
