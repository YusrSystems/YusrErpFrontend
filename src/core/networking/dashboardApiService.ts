import { ApiConstants, BaseFilterableApiService, YusrApiHelper } from "@yusr_systems/core";
import type DashboardData from "../data/dashboardData";
import type { RequestResult } from "../data/requestResult";

export default class DashboardApiService extends BaseFilterableApiService<DashboardData>
{
  routeName: string = "dashboard";

  async get(): Promise<RequestResult<DashboardData>>
  {
    const url = `${ApiConstants.baseUrl}/${this.routeName}`;
    return await YusrApiHelper.Get<DashboardData>(url);
  }
}
