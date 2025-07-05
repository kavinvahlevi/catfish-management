
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TipsTeaserCard({ className }: { className?: string }) {
    return (
        <Card className={cn("flex flex-col", className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary w-6 h-6" />
                    Tips Perawatan AI
                </CardTitle>
                <CardDescription>Dapatkan rekomendasi perawatan kolam dan pencegahan penyakit yang dipersonalisasi untuk peternakan Anda.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
                <Button asChild className="w-full">
                    <Link href="/tips">
                        Hasilkan Tips Sekarang <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
