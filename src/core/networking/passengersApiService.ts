import type { Passenger } from "@/app/features/passengers/data/passenger";
import { BaseApiService } from "@yusr_systems/core";

export default class PassengersApiService extends BaseApiService<Passenger>
{
  routeName: string = "Passengers";
}
