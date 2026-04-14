import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { InvoiceType, PurchasesSlice } from "../../core/data/invoice";
import { useAppSelector } from "../../core/state/store";
import UnauthorizedPage from "../unauthorized/unauthorizedPage";
import InvoicesPage from "./invoicesPage";
import { SuppliersSlice } from "../../core/data/account";

export default function PurchaseInvoicesPage()
{
  const authState = useAppSelector((state) => state.auth);
  const suppliersState = useAppSelector((state) => state.suppliers);
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
      slice={ PurchasesSlice }
      stateKey="purchases"
      dialogStateKey="purchasesDialog"
      title="إدارة المشتريات"
      fixedType={ InvoiceType.Purchase }
      selectFormState={ (state) => state.purchasesForm }
      accountSlice={SuppliersSlice}
      accountState={suppliersState}
    />
  );
}
