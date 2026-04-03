import type Branch from "@/app/features/branches/data/branch";
import { BaseApiService } from "@yusr_systems/core";

export default class BranchesApiService extends BaseApiService<Branch>
{
  routeName: string = "Branches";
}
