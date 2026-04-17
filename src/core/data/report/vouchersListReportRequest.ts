import type { FilterCondition } from "@yusr_systems/core";
import type { BaseReportRequest } from "./baseReportRequest";

export class VouchersListReportRequest implements BaseReportRequest
{
  condition?: FilterCondition;

  constructor(init?: Partial<VouchersListReportRequest>)
  {
    Object.assign(this, init);
  }
}
