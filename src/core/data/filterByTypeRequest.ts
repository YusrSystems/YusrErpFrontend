import type { FilterCondition } from "@yusr_systems/core";

export class FilterByTypeRequest
{
  public types: number[] = [];
  public condition?: FilterCondition;

  constructor(init?: Partial<FilterByTypeRequest>)
  {
    Object.assign(this, init);
  }
}
