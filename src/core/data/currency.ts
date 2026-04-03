import { BaseEntity } from "@yusr_systems/core";

export class Currency extends BaseEntity
{
  public name!: string;
  public code!: string;
  public isFeminine!: boolean;
  public plural!: string;
  public subName!: string;
  public subIsFeminine!: boolean;
  public subPlural!: string;

  constructor(init?: Partial<Currency>)
  {
    super();
    Object.assign(this, init);
  }
}
