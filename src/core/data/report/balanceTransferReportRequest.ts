import type { BaseReportRequest } from "./baseReportRequest";

export class BalanceTransferReportRequest implements BaseReportRequest
{
  balanceTransferId: number;
  tafqit: string;

  constructor(init?: Partial<BalanceTransferReportRequest>)
  {
    this.balanceTransferId = 0;
    this.tafqit = "";
    Object.assign(this, init);
  }
}
