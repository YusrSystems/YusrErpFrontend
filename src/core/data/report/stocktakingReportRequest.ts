import type { BaseReportRequest } from "./baseReportRequest";

export class StocktakingReportRequest implements BaseReportRequest
{
  stocktakingId: number;

  constructor(init?: Partial<StocktakingReportRequest>)
  {
    this.stocktakingId = 0;
    Object.assign(this, init);
  }
}
