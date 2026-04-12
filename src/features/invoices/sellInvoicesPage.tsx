import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { InvoiceType } from "../../core/data/invoice";
import { useAppSelector } from "../../core/state/store";
import UnauthorizedPage from "../unauthorized/unauthorizedPage";
import InvoicesPage from "./invoicesPage";

export default function SellInvoicesPage()
{
  const authState = useAppSelector((state) => state.auth);

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

  return <InvoicesPage type={ InvoiceType.Sell } />;
}
