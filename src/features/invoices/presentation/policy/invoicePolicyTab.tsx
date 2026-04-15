import { TextAreaField } from "@yusr_systems/ui";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoicePolicyTab()
{
  const {
    formData,
    slice,
    dispatch,
    authState,
    disabled
  } = useInvoiceContext();

  return (
    <TextAreaField
      label="السياسة / الشروط (تظهر في أسفل الفاتورة)"
      value={ formData.policy || authState.setting?.invoicePolicy || "" }
      onChange={ (e) => dispatch(slice.formActions.updateFormData({ policy: e.target.value })) }
      disabled={ disabled }
      className="h-100"
    />
  );
}
