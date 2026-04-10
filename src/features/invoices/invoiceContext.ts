import type { DialogMode } from "@yusr_systems/ui";
import { createContext, useContext } from "react";
import type { DetailedInvoice } from "../../core/data/invoice";

export type InvoiceContextType = {
  mode: DialogMode;
  handleChange: (
    update: Partial<DetailedInvoice> | ((prev: Partial<DetailedInvoice>) => Partial<DetailedInvoice>)
  ) => void;
  formData: Partial<DetailedInvoice>;
  isInvalid: (field: string) => boolean;
  getError: (field: string) => string;
  clearError: (field: string) => void;
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
