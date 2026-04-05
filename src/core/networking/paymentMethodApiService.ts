import { BaseApiService } from "@yusr_systems/core";
import type PaymentMethod from "../data/paymentMethod";

export default class PaymentMethodsApiService extends BaseApiService<PaymentMethod> {
  routeName: string = "PaymentMethods";
}
