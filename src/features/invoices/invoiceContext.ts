import type { DialogMode } from "@yusr_systems/ui";
import { createContext, useContext } from "react";
import Invoice from "../../core/data/invoice";
import type { AuthState, User } from "@yusr_systems/core";
import type { Setting } from "../../core/data/setting";
import type { ThunkDispatch } from "redux-thunk";

export type InvoiceContextType = {
  mode: DialogMode;
  formData: Partial<Invoice>;
  handleChange: (
    update: Partial<Invoice> | ((prev: Partial<Invoice>) => Partial<Invoice>)
  ) => void;
  isInvalid: (field: string) => boolean;
  getError: (field: string) => string;
  clearError: (field: string) => void;
  authState: AuthState<User, Setting>;
  dispatch: ThunkDispatch<any, any, any>;
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
