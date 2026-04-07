import { BaseApiService } from "@yusr_systems/core";
import type PricingMethod from "../data/pricingMethod";

export default class PricingMethodsApiService extends BaseApiService<PricingMethod>
{
  routeName: string = "PricingMethods";
}
