import { BaseApiService } from "@yusr_systems/core";
import type Voucher from "../data/voucher";

export default class VouchersApiService extends BaseApiService<Voucher>
{
  routeName: string = "Vouchers";
}
