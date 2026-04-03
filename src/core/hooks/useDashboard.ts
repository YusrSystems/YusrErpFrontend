import { useEffect, useState } from "react";
import { Dashboard } from "../data/dashboard";
import DashboardApiService from "../networking/dashboardApiService";

export default function useDashbaord()
{
  const [data, setData] = useState<Dashboard | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  useEffect(() =>
  {
    const dashboardFetch = async () =>
    {
      const service = new DashboardApiService();
      setLoading(true);
      const response = await service.get();
      setLoading(false);
      setData(response.data);
    };
    dashboardFetch();
  }, []);

  return { data, loading };
}
