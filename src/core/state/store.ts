import { configureStore } from "@reduxjs/toolkit";
import { createAuthSlice, User } from "@yusr_systems/core";
import { setupAuthListeners } from "@yusr_systems/ui";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import branchDialogReducer from "../../features/branches/logic/branchDialogSlice";
import branchReducer from "../../features/branches/logic/branchSlice";
import roleDialogReducer from "../../features/roles/logic/roleDialogSlice";
import roleReducer from "../../features/roles/logic/roleSlice";
import taxDialogReducer from "../../features/taxes/logic/taxDialogSlice";
import taxReducer from "../../features/taxes/logic/taxSlice";
import userDialogReducer from "../../features/users/logic/userDialogSlice";
import userReducer from "../../features/users/logic/userSlice";
import type { Setting } from "../data/setting";
import cityReducer from "./shared/citySlice";
import countryReducer from "./shared/countrySlice";
import currencyReducer from "./shared/currencySlice";
import systemReducer from "./shared/systemSlice";
import storeReducer from "../../features/stores/logic/storeSlice";
import storeDialogReducer from "../../features/stores/logic/storeDialogSlice";
import unitReducer from "../../features/units/logic/unitSlice";
import unitDialogReducer from "../../features/units/logic/unitDialogSlice";
const authSlice = createAuthSlice<User, Setting>();
export const {
  login,
  logout,
  updateLoggedInUser,
  updateSetting,
  syncFromStorage,
} = authSlice.actions;

export const store = configureStore({
  reducer: {
    branch: branchReducer,
    branchDialog: branchDialogReducer,
    role: roleReducer,
    roleDialog: roleDialogReducer,
    user: userReducer,
    userDialog: userDialogReducer,
    city: cityReducer,
    country: countryReducer,
    currency: currencyReducer,
    auth: authSlice.reducer,
    system: systemReducer,
    tax: taxReducer,
    taxDialog: taxDialogReducer,
    store: storeReducer,
    storeDialog: storeDialogReducer,
    unit: unitReducer,
    unitDialog: unitDialogReducer,
  },
});

setupAuthListeners(store.dispatch, {
  logout: authSlice.actions.logout,
  syncFromStorage: authSlice.actions.syncFromStorage,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
