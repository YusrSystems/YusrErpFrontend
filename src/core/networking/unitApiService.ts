import { BaseApiService } from "@yusr_systems/core";
import type Unit from "../data/unit";

export default class UnitsApiService extends BaseApiService<Unit>
{
  routeName: string = "Units";
}
