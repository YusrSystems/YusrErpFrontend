import { ApiConstants, BaseApiService, type FilterResult, type RequestResult, YusrApiHelper } from "@yusr_systems/core";
import type Account from "../data/account";
import type { FilterByTypeRequest } from "../data/filterByTypeRequest";

export default class AccountsApiService extends BaseApiService<Account>
{
  routeName: string = "Accounts";

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request?: FilterByTypeRequest
  ): Promise<RequestResult<FilterResult<Account>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      request
    );
  }
}
