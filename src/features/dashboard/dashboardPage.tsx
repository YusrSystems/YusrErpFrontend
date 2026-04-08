import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import CurrencyBadge from "./currencyBadge";
import { DashboardChartAreaInteractive } from "./dashboardChartAreaInteractive";
import { DashboardSectionCards } from "./dashboardSectionCards";
import DashboardSkeleton from "./dashboardSkeleton";
import { fetchDashboardData } from "./logic/dashboardSlice";

export default function DashboardPage()
{
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.dashboard);
  const currency = useAppSelector((state) => state.auth.setting?.currency?.code) || "ريال سعودي";

  useEffect(() =>
  {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (!data)
  {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <CurrencyBadge currency={ currency } />

      <DashboardSectionCards data={ data } />
      <DashboardChartAreaInteractive data={ data } />
    </div>
  );
}
