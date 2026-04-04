import type Store from "../data/store";
import { BaseApiService } from "@yusr_systems/core";

export default class StoresApiService extends BaseApiService<Store> {
  routeName: string = "Stores";
}
