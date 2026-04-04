
import { CityFilterColumns, type ValidationRule, Validators } from "@yusr_systems/core";
import { ChangeDialog, type CommonChangeDialogProps, FieldGroup, FieldsSection, FormField, SearchableSelect, TextField, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import type Branch from "../../../core/data/branch";
import { filterCities } from "../../../core/state/shared/citySlice";
import { useAppSelector, useAppDispatch } from "../../../core/state/store";

export default function ChangeBranchDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Branch>)
{
  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();
  const validationRules: ValidationRule<Partial<Branch>>[] = useMemo(
    () => [{ field: "name", selector: (d) => d.name, validators: [Validators.required("اسم الفرع مطلوب")] }, {
      field: "cityId",
      selector: (d) => d.cityId,
      validators: [Validators.required("يرجى اختيار المدينة")]
    }],
    []
  );
  const { formData, handleChange, getError, isInvalid, validate } = useEntityForm<Branch>(entity, validationRules);

  useEffect(() =>
  {
    dispatch(filterCities(undefined));
  }, [dispatch]);

  return (
    <ChangeDialog<Branch>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} فرع` }
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => cityState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup className="py-2">
        <TextField
          label="اسم الفرع"
          value={ formData.name || "" }
          onChange={ (e) => handleChange({ name: e.target.value }) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
          required={ true }
        />

        <FormField label="المدينة" required={ true } isInvalid={ isInvalid("cityId") } error={ getError("cityId") }>
          <SearchableSelect
            items={ cityState.entities.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر المدينة"
            value={ formData.cityId?.toString() || "" }
            onValueChange={ (val) => handleChange({ cityId: Number(val) }) }
            columnsNames={ CityFilterColumns.columnsNames }
            onSearch={ (condition) => dispatch(filterCities(condition)) }
            errorInputClass={ isInvalid("cityId") ? "border-red-500 ring-red-500" : "" }
            disabled={ cityState.isLoading }
          />
        </FormField>

        <FieldsSection title="الموقع" columns={ 2 }>
          <TextField
            label="الشارع"
            value={ formData.street || "" }
            onChange={ (e) => handleChange({ street: e.target.value }) }
          />
          <TextField
            label="الحي"
            value={ formData.district || "" }
            onChange={ (e) => handleChange({ district: e.target.value }) }
          />
          <TextField
            label="رقم المبنى"
            value={ formData.buildingNumber || "" }
            onChange={ (e) => handleChange({ buildingNumber: e.target.value }) }
          />
          <TextField
            label="الرمز البريدي"
            value={ formData.postalCode || "" }
            onChange={ (e) => handleChange({ postalCode: e.target.value }) }
          />
        </FieldsSection>
      </FieldGroup>
    </ChangeDialog>
  );
}
