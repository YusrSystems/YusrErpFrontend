import { ApiConstants, BaseFilterableApiService, YusrApiHelper } from "@yusr_systems/core";
import { Dashboard } from "../data/dashboard";
import type { RequestResult } from "../data/requestResult";

export default class DashboardApiService extends BaseFilterableApiService<Dashboard>
{
  routeName: string = "dashboard";

  async get(): Promise<RequestResult<Dashboard>>
  {
    const url = `${ApiConstants.baseUrl}/${this.routeName}`;
    return await YusrApiHelper.Get<Dashboard>(url);
  }
}
