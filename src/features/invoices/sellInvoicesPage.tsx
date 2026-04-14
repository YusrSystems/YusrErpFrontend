import { SystemPermissions } from "@yusr_systems/core";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { InvoiceType, SalesSlice } from "../../core/data/invoice";
import { useAppSelector } from "../../core/state/store";
import UnauthorizedPage from "../unauthorized/unauthorizedPage";
import InvoicesPage from "./invoicesPage";

export default function SellInvoicesPage()
{
  const authState = useAppSelector((state) => state.auth);

  const { invoiceId } = useParams();

  useEffect(() =>
  {
    if (invoiceId)
    {
      // openInvoiceDialog(invoiceId);
    }
  }, [invoiceId]);

  if (
    !SystemPermissions.hasAuth(
      authState.loggedInUser?.role?.permissions ?? [],
      SystemPermissionsResources.InvoiceSell,
      SystemPermissionsActions.Get
    )
  )
  {
    return <UnauthorizedPage />;
  }

  return (
    <InvoicesPage
      slice={ SalesSlice }
      stateKey="sales"
      dialogStateKey="salesDialog"
      title="إدارة المبيعات"
      fixedType={ InvoiceType.Sell }
      selectFormState={ (state) => state.salesForm }
    />
  );
}
