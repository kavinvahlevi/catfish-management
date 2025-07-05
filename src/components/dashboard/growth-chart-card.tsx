"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useFarmData } from "@/contexts/FarmDataContext";
import { cn } from "@/lib/utils";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
    weight: {
        label: "Berat (gram)",
        color: "hsl(var(--primary))",
    },
};

export function GrowthChartCard({ className }: { className?: string }) {
    const { growthData } = useFarmData();

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
                        data={growthData}
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
                        <YAxis strokeWidth={0} width={0} />
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
