import { BranchesApiService } from "@yusr_systems/core";
import { createGenericEntitySlice } from "@yusr_systems/ui";

const { reducer, actions } = createGenericEntitySlice("branch", new BranchesApiService());

export const { setCurrentPage: setCurrentBranchesPage, refresh: refreshBranches, filter: filterBranches } = actions;
export default reducer;
