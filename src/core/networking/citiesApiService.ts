import { ApiConstants, BaseFilterableApiService, YusrApiHelper } from "@yusr_systems/core";
import type { City } from "../data/city";
import type { FilterCondition } from "../data/filterCondition";
import type { FilterResult } from "../data/filterResult";
import type { RequestResult } from "../data/requestResult";

export default class CitiesApiService extends BaseFilterableApiService<City>
{
  routeName: string = "Cities";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition
  ): Promise<RequestResult<FilterResult<City>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
