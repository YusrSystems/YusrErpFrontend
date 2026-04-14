import type { AuthState, User } from "@yusr_systems/core";
import type { DialogMode, IEntityState } from "@yusr_systems/ui";
import { createContext, useContext } from "react";
import type { ThunkDispatch } from "redux-thunk";
import type Account from "../../../core/data/account";
import type Invoice from "../../../core/data/invoice";
import type { Setting } from "../../../core/data/setting";
import type { InvoiceSliceType } from "../changeInvoiceDialog";
import type { AccountSliceType } from "../../../core/data/account";

export type InvoiceContextType = {
  formData: Partial<Invoice>;
  errors: Record<string, string>;
  getError: (field: string) => string;
  isInvalid: (field: string) => boolean;
  slice: InvoiceSliceType;
  mode: DialogMode;
  authState: AuthState<User, Setting>;
  dispatch: ThunkDispatch<any, any, any>;
  disabled: boolean;
  returnDisabled: boolean;
  accountState: IEntityState<Account>;
  accountSlice: AccountSliceType;
};
export const InvoiceContext = createContext<InvoiceContextType | undefined>(
  undefined
);

export function useInvoiceContext(): InvoiceContextType
{
  const invoiceContext = useContext(InvoiceContext);
  if (!invoiceContext)
  {
    throw new Error(
      "useInvoiceContext must be used within an InvoiceContext.Provider"
    );
  }
  return invoiceContext;
}
