import { BaseEntity } from "@yusr_systems/core";

export class YearlyData
{
  public sales: number[] = [];
  public purchases: number[] = [];
  public salesReturns: number[] = [];
  public purchasesReturns: number[] = [];
  public receiptVouchers: number[] = [];
  public paymentVouchers: number[] = [];
}

export default class DashboardData extends BaseEntity
{
  public weeklySales: number[] = [];
  public weeklyPurchases: number[] = [];
  public weeklyReceipts: number[] = [];
  public weeklyPayments: number[] = [];
  public monthlyData: number[] = [];
  public yearlyData: YearlyData = new YearlyData();

  constructor(init?: Partial<DashboardData>)
  {
    super();
    Object.assign(this, init);
    if (init?.yearlyData)
    {
      this.yearlyData = Object.assign(new YearlyData(), init.yearlyData);
    }
  }
}
