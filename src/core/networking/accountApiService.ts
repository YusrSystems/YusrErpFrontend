import { BaseApiService } from "@yusr_systems/core";
import type Account from "../data/account";

export default class AccountsApiService extends BaseApiService<Account> {
  routeName: string = "Accounts";
}