import { ApiConstants, BaseFilterableApiService, YusrApiHelper } from "@yusr_systems/core";
import type { Currency } from "../data/currency";
import type { FilterCondition } from "../data/filterCondition";
import type { FilterResult } from "../data/filterResult";
import type { RequestResult } from "../data/requestResult";

export default class CurrenciesApiService extends BaseFilterableApiService<Currency>
{
  routeName: string = "Currencies";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition
  ): Promise<RequestResult<FilterResult<Currency>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
