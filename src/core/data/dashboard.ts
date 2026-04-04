import { BaseEntity } from "@yusr_systems/core";

export class Dashboard extends BaseEntity
{
  constructor(init?: Partial<Dashboard>)
  {
    super();
    Object.assign(this, init);
  }
}
