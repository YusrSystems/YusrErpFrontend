import { BaseEntity } from "@yusr_systems/core";

export default class Registration extends BaseEntity
{
  public email!: string;
  public password!: string;
  public companyName!: string;
  public branchName!: string;
  public companyBusinessCategory!: string;
  public companyPhone!: string;
  public crn!: string;
  public vatNumber!: string;
  public username!: string;
  public userPassword!: string;
  public currencyId!: number;
  public salesDelegateId?: number;
  public cityId!: number;
  public street?: string;
  public district?: string;
  public buildingNumber?: string;
  public postalCode?: string;

  constructor(init?: Partial<Registration>)
  {
    super();
    Object.assign(this, init);
  }
}
