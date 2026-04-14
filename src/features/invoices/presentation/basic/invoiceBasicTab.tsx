import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../../../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../../../core/auth/systemPermissionsResources";
import StoreItemSelector from "../../../items/storeItemSelector";
import { useInvoiceContext } from "../../logic/invoiceContext";
import InvoiceProfitDialog from "../profit/InvoiceProfitDialog";
import InvoiceBasicInfo from "./invoiceBasicInfo";
import InvoiceGlobalSettlements from "./invoiceGlobalSettlements";
import InvoiceItemsSummary from "./invoiceItemsSummary";
import InvoiceItemsTable from "./invoiceItemsTable";

export default function InvoiceBasicTab()
{
  const {
    slice,
    authState,
    dispatch
  } = useInvoiceContext();

  return (
    <div className="flex flex-col gap-6">
      <InvoiceBasicInfo />
      <StoreItemSelector onSelect={ (item) => {
        console.log(item);
        dispatch(slice.formActions.addItem(item)) }} />
      <InvoiceItemsTable />
      <div className="flex flex-col-reverse lg:flex-row items-stretch gap-3">
        { SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.InvoiceAddSettlement,
          SystemPermissionsActions.Get
        ) && <InvoiceGlobalSettlements /> }

        { SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.InvoiceShowProfit,
          SystemPermissionsActions.Get
        ) && <InvoiceProfitDialog /> }
        <InvoiceItemsSummary />
      </div>
    </div>
  );
}
