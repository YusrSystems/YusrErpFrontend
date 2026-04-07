import { BaseApiService } from "@yusr_systems/core";
import type Invoice from "../data/invoice";

export default class InvoicesApiService extends BaseApiService<Invoice>
{
  routeName: string = "Invoices";
}
