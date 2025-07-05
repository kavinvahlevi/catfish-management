"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
    { month: "Januari", weight: 186 },
    { month: "Februari", weight: 305 },
    { month: "Maret", weight: 237 },
    { month: "April", weight: 73 },
    { month: "Mei", weight: 209 },
    { month: "Juni", weight: 214 },
];

const chartConfig = {
    weight: {
        label: "Berat (gram)",
        color: "hsl(var(--primary))",
    },
};

export function GrowthChartCard({ className }: { className?: string }) {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Monitoring Pertumbuhan</CardTitle>
                <CardDescription>Berat rata-rata lele per bulan (gram)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Line
                            dataKey="weight"
                            type="natural"
                            stroke="var(--color-weight)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-weight)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
