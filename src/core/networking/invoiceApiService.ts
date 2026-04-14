import { ApiConstants, BaseApiService, type FilterResult, type RequestResult, YusrApiHelper } from "@yusr_systems/core";
import type { FilterByTypeRequest } from "../data/filterByTypeRequest";
import type Invoice from "../data/invoice";
import type { InvoiceVoucher } from "../data/invoice";

export default class InvoicesApiService extends BaseApiService<Invoice>
{
  routeName: string = "Invoices";

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request: FilterByTypeRequest
  ): Promise<RequestResult<FilterResult<Invoice>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      request
    );
  }

  async ConvertToSell(
    invoiceId: number,
    ignoreWarnings: boolean,
    invoiceVouchers: InvoiceVoucher[] = []
  ): Promise<RequestResult<Invoice>>
  {
    return await YusrApiHelper.Put(
      `${ApiConstants.baseUrl}/${this.routeName}/ConvertToSell?invoiceId=${invoiceId}&ignoreWarnings=${ignoreWarnings}`,
      invoiceVouchers
    );
  }
}
