import InvoiceBasicInfo from "./invoiceBasicInfo";
import InvoiceItemsSummary from "./invoiceItemsSummary";

export default function InvoiceBasicTab()
{
  return (
    <div className="flex flex-col gap-6">
      <InvoiceBasicInfo />

      <div className="flex">
        <InvoiceItemsSummary />
      </div>
    </div>
  );
}
