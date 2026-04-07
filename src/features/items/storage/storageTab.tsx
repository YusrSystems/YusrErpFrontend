import {
  Button,
  FormField,
  NumberField,
  SearchableSelect,
  TextField,
} from "@yusr_systems/ui";
import { useItemContext } from "../itemContext";
import { Plus, Trash2 } from "lucide-react";
import { ItemStore } from "../../../core/data/item";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { filterStores } from "../../stores/logic/storeSlice";
import { StoreFilterColumns } from "../../../core/data/store";

export default function StorageTab() {
  const dispatch = useAppDispatch();

  const { formData, handleChange, isInvalid, getError } = useItemContext();
  const storeState = useAppSelector((state) => state.store);

  const addStore = () =>
    handleChange({
      itemStores: [...(formData.itemStores || []), new ItemStore()],
    });
  const updateStore = (index: number, updates: Partial<ItemStore>) => {
    const list = [...(formData.itemStores || [])];
    list[index] = { ...list[index], ...updates }; // دمج التحديثات الجديدة

    if (updates.initialQuantity !== undefined) {
      const totalInitial = list.reduce(
        (sum, store) => sum + (Number(store.initialQuantity) || 0),
        0,
      );
      handleChange({ itemStores: list, initialQuantity: totalInitial });
    } else {
      handleChange({ itemStores: list });
    }
  };
  const removeStore = (index: number) => {
    const list = [...(formData.itemStores || [])];
    list.splice(index, 1);
    const totalInitial = list.reduce(
      (sum, store) => sum + (Number(store.initialQuantity) || 0),
      0,
    );
    handleChange({ itemStores: list, initialQuantity: totalInitial });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-3 gap-6">
        <NumberField
          label="الحد الأدنى للكمية"
          value={formData.minQuantity || ""}
          onChange={(val) => handleChange({ minQuantity: val })}
        />
        <NumberField
          label="الحد الأعلى للكمية"
          value={formData.maxQuantity || ""}
          onChange={(val) => handleChange({ maxQuantity: val })}
        />
        <TextField
          label="موقع المادة في المخزن"
          value={formData.location || ""}
          onChange={(e) => handleChange({ location: e.target.value })}
        />
        <NumberField
          label="الكمية الافتتاحية الإجمالية"
          value={formData.initialQuantity || ""}
          disabled={true}
          className="bg-muted font-bold"
        />
        <NumberField
          label="الكمية الحالية"
          value={formData.quantity || ""}
          disabled={true}
          className="bg-muted font-bold"
        />
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">طرق التخزين</h3>
          <Button type="button" size="sm" onClick={addStore}>
            <Plus className="w-4 h-4 ml-2" /> إضافة طريقة تخزين
          </Button>
        </div>

        <div className="bg-muted/20 rounded-lg border overflow-hidden">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-3 w-16">الرقم</th>
                <th className="p-3 w-48">المستودع</th>
                <th className="p-3 w-48">الكمية الافتتاحية</th>
                <th className="p-3 w-48">الكمية الحالية</th>
                <th className="p-3 w-16 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {formData.itemStores?.map((store, index) => (
                <tr key={index} className="border-t border-muted">
                  <td className="p-3 font-bold">{index + 1}</td>
                  <td className="p-3">
                    <FormField
                      label=""
                      isInvalid={isInvalid("storeId")}
                      error={getError("storeId")}
                    >
                      <SearchableSelect
                        items={storeState.entities.data ?? []}
                        itemLabelKey="storeName"
                        itemValueKey="id"
                        value={store.storeId?.toString() || ""}
                        onValueChange={(val) => {
                          const selected = storeState.entities.data?.find(
                            (s) => s.id.toString() === val,
                          );
                          updateStore(index, {
                            storeId: selected?.id,
                            storeName: selected?.storeName,
                          });
                        }}
                        columnsNames={StoreFilterColumns.columnsNames}
                        onSearch={(condition) =>
                          dispatch(filterStores(condition))
                        }
                        disabled={storeState.isLoading}
                      />
                    </FormField>
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      value={store.initialQuantity || ""}
                      onChange={(val) =>
                        updateStore(index, {
                          initialQuantity: val,
                        })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      value={store.quantity || ""}
                      disabled
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => removeStore(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {formData.itemStores?.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              لا توجد مستودعات مضافة
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
