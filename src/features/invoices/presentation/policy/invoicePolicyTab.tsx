import { TextAreaField } from "@yusr_systems/ui";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoicePolicyTab()
{
  const {
    mode,
    formData,
    slice,
    dispatch,
    authState,
    disabled,
    returnDisabled
  } = useInvoiceContext();

  return (
    <TextAreaField
      label="السياسة / الشروط (تظهر في أسفل الفاتورة)"
      value={ formData.policy || authState.setting?.invoicePolicy || "" }
      onChange={ (e) => dispatch(slice.formActions.updateFormData({ policy: e.target.value })) }
      disabled={ disabled || returnDisabled }
      className="h-100"
    />
  );
}
