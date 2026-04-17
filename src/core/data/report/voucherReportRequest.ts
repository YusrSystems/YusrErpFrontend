import type { BaseReportRequest } from "./baseReportRequest";

export class VoucherReportRequest implements BaseReportRequest
{
  voucherId: number;
  tafqit: string;

  constructor(init?: Partial<VoucherReportRequest>)
  {
    this.voucherId = 0;
    this.tafqit = "";
    Object.assign(this, init);
  }
}
