import { BaseApiService } from "@yusr_systems/core";
import type Item from "../data/item";

export default class ItemsApiService extends BaseApiService<Item>
{
  routeName: string = "Items";
}
