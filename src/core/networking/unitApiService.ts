import { ApiConstants, BaseApiService, type RequestResult, YusrApiHelper } from "@yusr_systems/core";
import type Unit from "../data/unit";
import type ServiceIds from "../data/serviceIds";

export default class UnitsApiService extends BaseApiService<Unit>
{
  routeName: string = "Units";

  async GetServiceIds(): Promise<RequestResult<ServiceIds>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/ServiceIds`);
  }
}
