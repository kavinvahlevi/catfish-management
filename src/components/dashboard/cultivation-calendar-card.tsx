"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function CultivationCalendarCard({ className }: { className?: string }) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <Card className={cn("flex flex-col", className)}>
            <CardHeader>
                <CardTitle>Kalender Siklus Budidaya</CardTitle>
                <CardDescription>Tandai tanggal penting dalam siklus.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0"
                    classNames={{
                        head_cell: "w-full",
                        cell: "w-full",
                    }}
                />
            </CardContent>
        </Card>
    );
}
