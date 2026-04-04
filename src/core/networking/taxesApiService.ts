import { BaseApiService } from "@yusr_systems/core";
import type { Tax } from "../data/tax";

export default class TaxesApiService extends BaseApiService<Tax>
{
  routeName: string = "Taxes";
}
