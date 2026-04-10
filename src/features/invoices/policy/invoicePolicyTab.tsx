import { TextAreaField } from "@yusr_systems/ui";
import { useInvoiceContext } from "../invoiceContext";

export default function InvoicePolicyTab()
{
  const {
    mode,
    formData,
    handleChange
  } = useInvoiceContext();
  return (
    <TextAreaField
      label="السياسة / الشروط (تظهر في أسفل الفاتورة)"
      value={ formData.policy || "" }
      onChange={ (e) => handleChange({ policy: e.target.value }) }
      disabled={ mode === "update" }
      className="h-100"
    />
  );
}
