import { TextField } from "@yusr_systems/ui";
import { useInvoiceContext } from "../invoiceContext";

export default function InvoiceItemsSummary()
{
  const invoiceContext = useInvoiceContext();
  const formData = invoiceContext.formData;
  return (
    <div className="flex flex-wrap gap-3 sm:flex-nowrap ">
      <TextField label="الإجمالي قبل الضريبة" value={ formData.fullAmount } disabled />
      <TextField label="الإجمالي بعد الضريبة" value={ formData.discountAmount } disabled />
      <TextField label="إجمالي الضرائب" value={ formData.addedAmount } disabled />
      <TextField
        label="المبلغ المدفوع"
        value={ formData.paidAmount }
        disabled
        className="border-2 border-solid border-green-950"
        style={ {
          backgroundColor: "hsla(135 100% 22.1% / 0.62)"
        } }
      />
      <TextField
        label="المبلغ المتبقي"
        value={ formData.addedAmount }
        disabled
        className="border-2 border-solid border-red-950"
        style={ {
          backgroundColor: "hsla(0 100% 22.1% / 0.62)"
        } }
      />
    </div>
  );
}
