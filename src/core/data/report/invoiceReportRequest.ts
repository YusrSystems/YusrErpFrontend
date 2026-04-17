import type { BaseReportRequest } from "./baseReportRequest";

export class InvoiceReportRequest implements BaseReportRequest
{
  invoiceId: number;

  constructor(init?: Partial<InvoiceReportRequest>)
  {
    this.invoiceId = 0;
    Object.assign(this, init);
  }
}
