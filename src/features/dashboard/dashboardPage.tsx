import { SystemPermissionsActions } from "@/app/core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import useDashbaord from "@/app/core/hooks/useDashboard";
import { useAppSelector } from "@/app/core/state/store";
import { SystemPermissions } from "@yusr_systems/core";
import TripsPage from "../trips/presentation/tripsPage";
import { DashboardChartAreaInteractive } from "./dashboardChartAreaInteractive";
import { DashboardSectionCards } from "./dashboardSectionCards";

export default function DashboardPage()
{
  const { data } = useDashbaord();
  const authState = useAppSelector((state) => state.auth);
  const permissions: string[] = authState.loggedInUser?.role?.permissions || [];
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      { data && <DashboardSectionCards data={ data } /> }
      <DashboardChartAreaInteractive
        tripsInTime={ (data?.tripsInTime || []).map((trip) => ({
          ...trip,
          date: trip.date instanceof Date ? trip.date : new Date(trip.date)
        })) }
      />
      { SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Trips, SystemPermissionsActions.Get) && (
        <TripsPage />
      ) }
    </div>
  );
}
