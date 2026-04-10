import InvoiceBasicInfo from "./invoiceBasicInfo";
import InvoiceItemsSummary from "./invoiceItemsSummary";
import InvoiceItemsTable from "./invoiceItemsTable";

export default function InvoiceBasicTab()
{
  return (
    <div className="flex flex-col gap-6">
      <InvoiceBasicInfo />
      <InvoiceItemsTable />
      <div className="flex">
        <InvoiceItemsSummary />
      </div>
    </div>
  );
}
