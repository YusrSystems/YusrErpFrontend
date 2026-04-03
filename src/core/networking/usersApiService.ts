import type User from "@/app/features/users/data/user";
import { BaseApiService } from "@yusr_systems/core";

export default class UsersApiService extends BaseApiService<User>
{
  routeName: string = "Users";
}
