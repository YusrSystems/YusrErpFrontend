import type { TripInTimeData } from "@/app/core/data/dashboard";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, ToggleGroup, ToggleGroupItem, useIsMobile } from "@yusr_systems/ui";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = { totalTrips: { label: "الرحلات", color: "var(--primary)" } } satisfies ChartConfig;

type ChartAreaInteractiveProps = { tripsInTime: TripInTimeData[]; };

export function DashboardChartAreaInteractive({ tripsInTime }: ChartAreaInteractiveProps)
{
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() =>
  {
    if (isMobile)
    {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // 1. SAFE DATE FORMATTER HELPER
  const formatDate = (value: any) => {
    // Check if value is null, undefined, or a boolean (standard ReactNode edge cases)
    if (value === null || value === undefined || typeof value === "boolean") {
      return "";
    }

    const date = new Date(value);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // 2. SAFE FILTERING
  const filteredData = tripsInTime.filter((item) =>
  {
    if (!item.date)
    {
      return false; // Skip if date is missing
    }

    const date = new Date(item.date);
    if (isNaN(date.getTime()))
    {
      return false; // Skip if date is invalid
    }

    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d")
    {
      daysToSubtract = 30;
    }
    else if (timeRange === "7d")
    {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className="@container/card m-4">
      <CardHeader>
        <CardTitle>مجموع الرحلات</CardTitle>
        <CardDescription></CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={ timeRange }
            onValueChange={ setTimeRange }
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">اخر 3 اشهر</ToggleGroupItem>
            <ToggleGroupItem value="30d">اخر 30 يوم</ToggleGroupItem>
            <ToggleGroupItem value="7d">اخر 7 ايام</ToggleGroupItem>
          </ToggleGroup>
          <Select value={ timeRange } onValueChange={ setTimeRange }>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="اخر 3 اشهر" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">اخر 90 يوم</SelectItem>
              <SelectItem value="30d" className="rounded-lg">اخر 30 يوم</SelectItem>
              <SelectItem value="7d" className="rounded-lg">اخر 7 ايام</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={ chartConfig } className="aspect-auto h-62.5 w-full">
          <AreaChart data={ filteredData }>
            <defs>
              <linearGradient id="fillTrips" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-totalTrips)" stopOpacity={ 1.0 } />
                <stop offset="95%" stopColor="var(--color-totalTrips)" stopOpacity={ 0.1 } />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={ false } />
            <XAxis
              dataKey="date"
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 8 }
              minTickGap={ 32 }
              tickFormatter={ formatDate } // <-- 3. USED HELPER HERE
            />
            <ChartTooltip
              cursor={ false }
              content={ 
                <ChartTooltipContent
                  labelFormatter={ formatDate } // <-- 4. USED HELPER HERE
                  indicator="dot"
                />
               }
            />
            <Area dataKey="totalTrips" type="natural" fill="url(#fillTrips)" stroke="var(--color-totalTrips)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
