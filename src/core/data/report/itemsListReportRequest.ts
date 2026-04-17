import type { FilterCondition } from "@yusr_systems/core";
import type { BaseReportRequest } from "./baseReportRequest";

export class ItemsListReportRequest implements BaseReportRequest
{
  condition?: FilterCondition;

  constructor(init?: Partial<ItemsListReportRequest>)
  {
    Object.assign(this, init);
  }
}
