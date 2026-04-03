import { BaseEntity } from "@yusr_systems/core";

export type TripInTimeData = { totalTrips: number; date: Date; };
export class Dashboard extends BaseEntity
{
  public totalTrips!: number;
  public totalPassengers!: number;
  public totalIncome!: number;
  public grothRate!: number;
  public tripsInTime!: TripInTimeData[];
  constructor(init?: Partial<Dashboard>)
  {
    super();
    Object.assign(this, init);
  }
}
