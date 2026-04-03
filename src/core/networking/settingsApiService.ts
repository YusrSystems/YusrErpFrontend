import { ApiConstants, YusrApiHelper } from "@yusr_systems/core";
import type { RequestResult } from "../data/requestResult";
import type { Setting } from "../data/setting";

export default class SettingsApiService
{
  routeName: string = "Settings";

  async Get(): Promise<RequestResult<Setting>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/Get`);
  }

  async Update(entity: Setting)
  {
    return await YusrApiHelper.Put(
      `${ApiConstants.baseUrl}/${this.routeName}/Update`,
      entity,
      undefined,
      "تم التعديل بنجاح"
    );
  }
}
