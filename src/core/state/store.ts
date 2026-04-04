import { configureStore } from "@reduxjs/toolkit";
import { createAuthSlice, User } from "@yusr_systems/core";
import { setupAuthListeners } from "@yusr_systems/ui";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userDialogReducer from "../../features/users/logic/userDialogSlice";
import userReducer from "../../features/users/logic/userSlice";
import type { Setting } from "../data/setting";
import cityReducer from "./shared/citySlice";
import roleReducer from "./shared/roleSlice";
import branchReducer from "./shared/branchSlice";
import countryReducer from "./shared/countrySlice";
import currencyReducer from "./shared/currencySlice";
import systemReducer from "./shared/systemSlice";

const authSlice = createAuthSlice<User, Setting>();
export const { login, logout, updateLoggedInUser, updateSetting, syncFromStorage } = authSlice.actions;

export const store = configureStore({
  reducer: {
    role: roleReducer,
    branch: branchReducer,
    user: userReducer,
    userDialog: userDialogReducer,
    city: cityReducer,
    country: countryReducer,
    currency: currencyReducer,
    auth: authSlice.reducer,
    system: systemReducer
  }
});

setupAuthListeners(store.dispatch, {
  logout: authSlice.actions.logout,
  syncFromStorage: authSlice.actions.syncFromStorage
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
