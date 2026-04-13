import { configureStore } from "@reduxjs/toolkit";
import { createAuthSlice, User } from "@yusr_systems/core";
import { setupAuthListeners } from "@yusr_systems/ui";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import dashboardReducer from "../../features/dashboard/logic/dashboardSlice";
import invoiceReducerUI from "../../features/invoices/logic/invoiceSliceUI";
import { itemTransferReducer } from "../../features/itemTransfers/logic/itemTransferSlice";
import registerReducer from "../../features/register/logic/registerSlice";
import { BanksAndBoxesSlice, BanksSlice, BoxesSlice, ClientsAndSuppliersSlice, ClientsSlice, EmployeesSlice, SuppliersSlice } from "../data/account";
import { BalanceTransferSlice } from "../data/balanceTransfer";
import { BranchSlice } from "../data/branchLogic";
import { InvoiceSlice } from "../data/invoice";
import { ItemSlice } from "../data/item";
import { ItemsSettlementSlice } from "../data/itemsSettlement";
import { ItemTransferSlice } from "../data/itemTransfer";
import { PaymentMethodSlice } from "../data/paymentMethod";
import { PricingMethodSlice } from "../data/pricingMethod";
import { RoleSlice } from "../data/role";
import type { Setting } from "../data/setting";
import { StocktakingSlice } from "../data/stocktaking";
import { StoreSlice } from "../data/store";
import { TaxSlice } from "../data/tax";
import { UnitSlice } from "../data/unit";
import { UserSlice } from "../data/UserLogic";
import { VoucherSlice } from "../data/voucher";
import cityReducer from "./shared/citySlice";
import countryReducer from "./shared/countrySlice";
import currencyReducer from "./shared/currencySlice";
import itemBarcodeReducer from "./shared/itemBarcodeSlice";
import serviceIdsReducer from "./shared/serviceIdsSlice";
import storeItemsReducer from "./shared/storeItemsSlice";
import systemReducer from "./shared/systemSlice";

const authSlice = createAuthSlice<User, Setting>();
export const {
  login,
  logout,
  updateLoggedInUser,
  updateSetting,
  syncFromStorage
} = authSlice.actions;

export const store = configureStore({
  reducer: {
    branch: BranchSlice.entityReducer,
    branchForm: BranchSlice.formReducer,
    branchDialog: BranchSlice.dialogReducer,
    role: RoleSlice.entityReducer,
    roleForm: RoleSlice.formReducer,
    roleDialog: RoleSlice.dialogReducer,
    user: UserSlice.entityReducer,
    userForm: UserSlice.formReducer,
    userDialog: UserSlice.dialogReducer,
    city: cityReducer,
    country: countryReducer,
    currency: currencyReducer,
    auth: authSlice.reducer,
    system: systemReducer,
    storeItems: storeItemsReducer,
    itemBarcode: itemBarcodeReducer,
    serviceIds: serviceIdsReducer,
    tax: TaxSlice.entityReducer,
    taxForm: TaxSlice.formReducer,
    taxDialog: TaxSlice.dialogReducer,
    store: StoreSlice.entityReducer,
    storeForm: StoreSlice.formReducer,
    storeDialog: StoreSlice.dialogReducer,
    unit: UnitSlice.entityReducer,
    unitForm: UnitSlice.formReducer,
    unitDialog: UnitSlice.dialogReducer,
    clients: ClientsSlice.entityReducer,
    clientsForm: ClientsSlice.formReducer,
    clientsDialog: ClientsSlice.dialogReducer,
    suppliers: SuppliersSlice.entityReducer,
    suppliersForm: SuppliersSlice.formReducer,
    suppliersDialog: SuppliersSlice.dialogReducer,
    employees: EmployeesSlice.entityReducer,
    employeesForm: EmployeesSlice.formReducer,
    employeesDialog: EmployeesSlice.dialogReducer,
    banks: BanksSlice.entityReducer,
    banksForm: BanksSlice.formReducer,
    banksDialog: BanksSlice.dialogReducer,
    boxes: BoxesSlice.entityReducer,
    boxesForm: BoxesSlice.formReducer,
    boxesDialog: BoxesSlice.dialogReducer,
    banksAndBoxes: BanksAndBoxesSlice.entityReducer,
    clientsAndSuppliers: ClientsAndSuppliersSlice.entityReducer,
    invoice: InvoiceSlice.entityReducer,
    invoiceDialog: InvoiceSlice.dialogReducer,
    paymentMethod: PaymentMethodSlice.entityReducer,
    paymentMethodForm: PaymentMethodSlice.formReducer,
    paymentMethodDialog: PaymentMethodSlice.dialogReducer,
    balanceTransfer: BalanceTransferSlice.entityReducer,
    balanceTransferForm: BalanceTransferSlice.formReducer,
    balanceTransferDialog: BalanceTransferSlice.dialogReducer,
    voucher: VoucherSlice.entityReducer,
    voucherForm: VoucherSlice.formReducer,
    voucherDialog: VoucherSlice.dialogReducer,
    item: ItemSlice.entityReducer,
    itemForm: ItemSlice.formReducer,
    itemDialog: ItemSlice.dialogReducer,
    pricingMethod: PricingMethodSlice.entityReducer,
    pricingMethodForm: PricingMethodSlice.formReducer,
    pricingMethodDialog: PricingMethodSlice.dialogReducer,
    stocktaking: StocktakingSlice.entityReducer,
    stocktakingForm: StocktakingSlice.formReducer,
    stocktakingDialog: StocktakingSlice.dialogReducer,
    itemTransfer: ItemTransferSlice.entityReducer,
    itemTransferForm: ItemTransferSlice.formReducer,
    itemTransferDialog: ItemTransferSlice.dialogReducer,
    itemsSettlement: ItemsSettlementSlice.entityReducer,
    itemsSettlementForm: ItemsSettlementSlice.formReducer,
    itemsSettlementDialog: ItemsSettlementSlice.dialogReducer,
    itemTransferUI: itemTransferReducer,
    dashboard: dashboardReducer,
    register: registerReducer,
    invoiceUI: invoiceReducerUI
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
