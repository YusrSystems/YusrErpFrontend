import { useAppDispatch } from "../../../../core/state/store";
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

  return (
    <div className="flex flex-col gap-6">
      <InvoiceBasicInfo />
      <StoreItemSelector onSelect={ (item) => dispatch(addItem(item)) } />
      <InvoiceItemsTable />
      <div className="flex flex-col-reverse lg:flex-row items-stretch gap-3">
  <div className="flex items-center gap-3">
    <InvoiceGlobalSettlements />
    <InvoiceProfitDialog />
  </div>
  <InvoiceItemsSummary />
</div>
    </div>
  );
}
