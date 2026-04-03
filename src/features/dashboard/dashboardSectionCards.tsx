import type { Dashboard } from "@/app/core/data/dashboard";
import ApplicationLang from "@/app/core/services/langService/applicationLang";
import { Card, CardDescription, CardHeader, CardTitle } from "@yusr_systems/ui";

type DashboardSectionCardsProps = { data: Dashboard; };

export function DashboardSectionCards({ data }: DashboardSectionCardsProps)
{
  const lang = ApplicationLang.getAppLangText().dashborad;
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{ lang.income }</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            { data.totalIncome }
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{ lang.totalPassengers }</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            { data.totalPassengers }
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{ lang.totalTrips }</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            { data.totalTrips }
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{ lang.growthRate }</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            %{ data.grothRate }
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
