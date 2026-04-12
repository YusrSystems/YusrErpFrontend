import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../../../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../../../core/auth/systemPermissionsResources";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import StoreItemSelector from "../../../items/storeItemSelector";
import { addItem } from "../../logic/invoiceSliceUI";
import InvoiceProfitDialog from "../profit/InvoiceProfitDialog";
import InvoiceBasicInfo from "./invoiceBasicInfo";
import InvoiceGlobalSettlements from "./invoiceGlobalSettlements";
import InvoiceItemsSummary from "./invoiceItemsSummary";
import InvoiceItemsTable from "./invoiceItemsTable";

export default function InvoiceBasicTab()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col gap-6">
      <InvoiceBasicInfo />
      <StoreItemSelector onSelect={ (item) => dispatch(addItem(item)) } />
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
