import { useAppDispatch } from "../../../../core/state/store";
import StoreItemSelector from "../../../items/storeItemSelector";
import { addItem } from "../../logic/invoiceSliceUI";
import InvoiceBasicInfo from "./invoiceBasicInfo";
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
      <div className="flex">
        <InvoiceItemsSummary />
      </div>
    </div>
  );
}
