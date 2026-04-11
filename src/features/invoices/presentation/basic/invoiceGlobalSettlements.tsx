import { NumberInput } from "@yusr_systems/ui";
import { Minus, Percent, Plus } from "lucide-react";
import { useAppDispatch } from "../../../../core/state/store";
import { useInvoiceContext } from "../../logic/invoiceContext";
import { onInvoiceAddedAmountChange, onInvoiceAddedPercentChange, onInvoiceDiscountAmountChange, onInvoiceDiscountPercentChange } from "../../logic/invoiceSliceUI";

export default function InvoiceGlobalSettlements()
{
  const dispatch = useAppDispatch();
  const {
    mode,
    formData
  } = useInvoiceContext();

  return (
    <div className="flex px-3 gap-6">
      { /* المبلغ المخصوم شامل الضريبة */ }
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">المبلغ المخصوم شامل الضريبة</h3>
        <div className="flex items-center gap-2">
          <div className="relative max-w-30">
            <Minus
              size={ 14 }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <NumberInput
              min={ 0 }
              className="max-w-30 pr-8"
              value={ formData.discountAmount || "0" }
              onChange={ (newValue) => dispatch(onInvoiceDiscountAmountChange(newValue ?? 0)) }
              disabled={ mode === "update" }
            />
          </div>
          <div className="relative max-w-30">
            <NumberInput
              min={ 0 }
              className="max-w-30 pr-8"
              value={ formData.discountPercent || "0" }
              onChange={ (newValue) => dispatch(onInvoiceDiscountPercentChange(newValue ?? 0)) }
              disabled={ mode === "update" }
            />
            <Percent
              size={ 14 }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </div>

      { /* المبلغ المضاف شامل الضريبة */ }
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">المبلغ المضاف شامل الضريبة</h3>
        <div className="flex items-center gap-2">
          <div className="relative max-w-30">
            <NumberInput
              min={ 0 }
              className="max-w-30 pr-8"
              value={ formData.addedAmount || "0" }
              onChange={ (newValue) => dispatch(onInvoiceAddedAmountChange(newValue ?? 0)) }
              disabled={ mode === "update" }
            />
            <Plus
              size={ 14 }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
          <div className="relative max-w-30">
            <NumberInput
              min={ 0 }
              className="max-w-30 pr-8"
              value={ formData.addedPercent || "0" }
              onChange={ (newValue) => dispatch(onInvoiceAddedPercentChange(newValue ?? 0)) }
              disabled={ mode === "update" }
            />
            <Percent
              size={ 14 }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
