import { BaseApiService } from "@yusr_systems/core";
import type Store from "../data/store";

export default class StoresApiService extends BaseApiService<Store>
{
  routeName: string = "Stores";
}
