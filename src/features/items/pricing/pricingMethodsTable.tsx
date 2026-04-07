import {
  Button,
  FormField,
  NumberField,
  SearchableSelect,
  TextField,
} from "@yusr_systems/ui";
import { Trash2 } from "lucide-react";
import { useItemContext } from "../itemContext";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { UnitFilterColumns, UnitSlice } from "../../../core/data/unit";
import { ItemType, type ItemUnitPricingMethod } from "../../../core/data/item";
import {
  PricingMethodFilterColumns,
  PricingMethodSlice,
} from "../../../core/data/pricingMethod";
import usePricingMethodsTable from "./usePricingMethodsTable";

export default function PricingMethodsTable() {
  const {
    dispatch,
    formData,
    unitState,
    pricingMethodState,
    updatePricingMethod,
    removePricingMethod,
  } = usePricingMethodsTable();

  return (
    <div className="bg-muted/20 rounded-lg border overflow-hidden overflow-x-auto">
      <table className="w-full text-sm text-right min-w-200">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th className="p-3 w-12">الرقم</th>
            <th className="p-3 w-32">الوحدة</th>
            <th className="p-3 w-40">طريقة التسعير</th>
            <th className="p-3 w-32">الكمية في الوحدة</th>
            <th className="p-3 w-32">سعر البيع</th>
            <th className="p-3 w-40">الباركود</th>
            <th className="p-3 w-40">الاسم</th>
            <th className="p-3 w-12 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {formData.itemUnitPricingMethods?.map((method, index) => (
            <tr key={index} className="border-t border-muted">
              <td className="p-3 font-bold">{index + 1}</td>
              <td className="p-3">
                <FormField label="">
                  <SearchableSelect
                    items={unitState.entities.data ?? []}
                    itemLabelKey="unitName"
                    itemValueKey="id"
                    value={method.unitId?.toString() || ""}
                    onValueChange={(val) => {
                      const selected = unitState.entities.data?.find(
                        (u) => u.id.toString() === val,
                      );
                      updatePricingMethod(index, {
                        unitId: selected?.id,
                        unitName: selected?.unitName,
                      });
                    }}
                    columnsNames={UnitFilterColumns.columnsNames}
                    onSearch={(condition) =>
                      dispatch(UnitSlice.entityActions.filter(condition))
                    }
                    disabled={
                      unitState.isLoading || formData.type === ItemType.Service
                    }
                  />
                </FormField>
              </td>
              <td className="p-3">
                <FormField label="">
                  <SearchableSelect
                    items={pricingMethodState.entities.data ?? []}
                    itemLabelKey="pricingMethodName"
                    itemValueKey="id"
                    value={method.pricingMethodId?.toString() || ""}
                    onValueChange={(val) => {
                      const selected = pricingMethodState.entities.data?.find(
                        (p) => p.id.toString() === val,
                      );
                      updatePricingMethod(index, {
                        pricingMethodId: selected?.id,
                        pricingMethodName: selected?.pricingMethodName,
                      });
                    }}
                    columnsNames={PricingMethodFilterColumns.columnsNames}
                    onSearch={(condition) =>
                      dispatch(
                        PricingMethodSlice.entityActions.filter(condition),
                      )
                    }
                    disabled={
                      pricingMethodState.isLoading ||
                      formData.type === ItemType.Service
                    }
                  />
                </FormField>
              </td>
              <td className="p-3">
                <NumberField
                  label=""
                  min={1}
                  disabled={method.unitId === formData.sellUnitId}
                  value={method.quantityMultiplier || 1}
                  onChange={(val) =>
                    updatePricingMethod(index, {
                      quantityMultiplier: val,
                    })
                  }
                />
              </td>
              <td className="p-3">
                <NumberField
                  label=""
                  min={0}
                  value={method.price || 0}
                  onChange={(val) => updatePricingMethod(index, { price: val })}
                />
              </td>
              <td className="p-3">
                <TextField
                  label=""
                  value={method.barcode || ""}
                  onChange={(e) =>
                    updatePricingMethod(index, {
                      barcode: e.target.value,
                    })
                  }
                  dir="ltr"
                />
              </td>
              <td className="p-3">
                <TextField
                  label=""
                  value={method.itemUnitPricingMethodName || ""}
                  onChange={(e) =>
                    updatePricingMethod(index, {
                      itemUnitPricingMethodName: e.target.value,
                    })
                  }
                />
              </td>
              <td className="p-3 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => removePricingMethod(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {formData.itemUnitPricingMethods?.length === 0 && (
        <div className="p-4 text-center text-muted-foreground">
          لا توجد طرق تسعير مضافة
        </div>
      )}
    </div>
  );
}
