import { SystemPermissions } from "@yusr_systems/core";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { ClientsSlice } from "../../core/data/account";
import { InvoiceType, SalesSlice } from "../../core/data/invoice";
import { useAppSelector } from "../../core/state/store";
import InvoicesPage from "./invoicesPage";

export default function SellInvoicesPage()
{
  const authState = useAppSelector((state) => state.auth);
  const clientsState = useAppSelector((state) => state.clients);

  const { invoiceId } = useParams();

  useEffect(() =>
  {
    if (invoiceId)
    {
      // openInvoiceDialog(invoiceId);
    }
  }, [invoiceId]);

  return (
    <InvoicesPage
      slice={ SalesSlice }
      stateKey="sales"
      dialogStateKey="salesDialog"
      title="إدارة المبيعات"
      fixedType={ InvoiceType.Sell }
      selectFormState={ (state) => state.salesForm }
      accountSlice={ ClientsSlice }
      accountState={ clientsState }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.InvoiceSell,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
