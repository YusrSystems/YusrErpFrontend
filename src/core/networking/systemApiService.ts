import { ApiConstants, YusrApiHelper } from "@yusr_systems/core";
import type { RequestResult } from "../data/requestResult";

export default class SystemApiService
{
  routeName: string = "System";

  async GetSystemPermissions(): Promise<RequestResult<string[]>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/Permissions`);
  }
}
