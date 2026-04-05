import { CityFilterColumns, type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { Button, ChangeDialog, FieldGroup, FieldsSection, NumberField, SearchableSelect, TextAreaField, TextField, useEntityForm } from "@yusr_systems/ui";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import Account, { AccountContact, AccountFilterColumns, AccountSlice } from "../../core/data/account";
import { filterCities } from "../../core/state/shared/citySlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeAccountDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Account>)
{
  const dispatch = useAppDispatch();
  const cityState = useAppSelector((state) => state.city);
  const accountState = useAppSelector((state) => state.account);

  const validationRules: ValidationRule<Partial<Account>>[] = useMemo(
    () => [{ field: "name", selector: (d) => d.name, validators: [Validators.required("يرجى إدخال اسم الحساب")] }, {
      field: "type",
      selector: (d) => d.type,
      validators: [Validators.required("يرجى اختيار نوع الحساب")]
    }],
    []
  );

  const initialValues = useMemo(() => ({
    ...entity,
    name: entity?.name || "",
    accountContacts: entity?.accountContacts || []
  }), [entity]);

  const { formData, handleChange, getError, isInvalid, validate } = useEntityForm<Account>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(filterCities(undefined));
    dispatch(AccountSlice.entityActions.filter(undefined));
  }, [dispatch]);

  // دوال إدارة جهات الاتصال (Account Contacts)
  const addContact = () =>
  {
    handleChange({ accountContacts: [...(formData.accountContacts || []), new AccountContact()] });
  };

  const updateContact = (index: number, field: keyof AccountContact, value: any) =>
  {
    const newContacts = [...(formData.accountContacts || [])];
    newContacts[index] = { ...newContacts[index], [field]: value };
    handleChange({ accountContacts: newContacts });
  };

  const removeContact = (index: number) =>
  {
    const newContacts = [...(formData.accountContacts || [])];
    newContacts.splice(index, 1);
    handleChange({ accountContacts: newContacts });
  };

  return (
    <ChangeDialog<Account>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} حساب` }
      className="sm:max-w-3xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => cityState.isLoading || accountState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <FieldsSection title="المعلومات الأساسية" columns={ 2 }>
          <TextField
            label="اسم الحساب"
            required
            value={ formData.name || "" }
            onChange={ (e) => handleChange({ name: e.target.value }) }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
          />

          {
            /* <SelectField
            label="نوع الحساب"
            required
            value={formData.type?.toString() || ""}
            onValueChange={(val) => handleChange({ type: Number(val) as AccountType })}
            isInvalid={isInvalid("type")}
            error={getError("type")}
            options={[
              { label: "أصول", value: AccountType.Asset.toString() },
              { label: "خصوم", value: AccountType.Liability.toString() },
              { label: "حقوق ملكية", value: AccountType.Equity.toString() },
              { label: "إيرادات", value: AccountType.Revenue.toString() },
              { label: "مصروفات", value: AccountType.Expense.toString() }
            ]}
          /> */
          }

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">الحساب الأب</label>
            <SearchableSelect
              items={ accountState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="الحساب الأب"
              value={ formData.parentId?.toString() || "" }
              columnsNames={ AccountFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(AccountSlice.entityActions.filter(condition)) }
              disabled={ accountState.isLoading }
              onValueChange={ (val) =>
              {
                const selected = accountState.entities.data?.find((a) => a.id.toString() === val);
                handleChange({ parentId: selected?.id, parentName: selected?.name });
              } }
            />
          </div>

          <NumberField
            label="الرصيد الافتتاحي"
            value={ formData.initialBalance || 0 }
            onChange={ (val) => handleChange({ initialBalance: val }) }
          />
        </FieldsSection>

        <FieldsSection title="المعلومات البنكية والضريبية" columns={ 2 }>
          <TextField
            label="رقم الحساب البنكي"
            value={ formData.bankAccountNumber || "" }
            onChange={ (e) => handleChange({ bankAccountNumber: e.target.value }) }
            dir="ltr"
          />
          <TextField
            label="الرقم الضريبي (VAT)"
            value={ formData.vatNumber || "" }
            onChange={ (e) => handleChange({ vatNumber: e.target.value }) }
            dir="ltr"
          />
          <TextField
            label="السجل التجاري (CRN)"
            value={ formData.crn || "" }
            onChange={ (e) => handleChange({ crn: e.target.value }) }
            dir="ltr"
          />
        </FieldsSection>

        <FieldsSection title="معلومات العنوان" columns={ 2 }>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">المدينة</label>
            <SearchableSelect
              items={ cityState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المدينة"
              value={ formData.cityId?.toString() || "" }
              columnsNames={ CityFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterCities(condition)) }
              disabled={ cityState.isLoading }
              onValueChange={ (val) =>
              {
                const selected = cityState.entities.data?.find((c) => c.id.toString() === val);
                handleChange({ cityId: selected?.id, city: selected });
              } }
            />
          </div>
          <TextField
            label="الحي"
            value={ formData.district || "" }
            onChange={ (e) => handleChange({ district: e.target.value }) }
          />
          <TextField
            label="الشارع"
            value={ formData.street || "" }
            onChange={ (e) => handleChange({ street: e.target.value }) }
          />
          <div className="grid grid-cols-2 gap-2">
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
          </div>
        </FieldsSection>

        <FieldsSection title="جهات الاتصال" columns={ 1 }>
          <div className="space-y-3">
            { formData.accountContacts?.map((contact, index) => (
              <div key={ index } className="flex items-center gap-3 bg-muted/30 p-3 rounded-md border">
                <div className="flex-1">
                  <TextField
                    label="اسم جهة الاتصال"
                    value={ contact.contactName || "" }
                    onChange={ (e) =>
                      updateContact(index, "contactName", e.target.value) }
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="رقم التواصل"
                    value={ contact.contactNumber || "" }
                    onChange={ (e) =>
                      updateContact(index, "contactNumber", e.target.value) }
                    dir="ltr"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mt-6"
                  onClick={ () => removeContact(index) }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )) }
            <Button type="button" variant="outline" size="sm" onClick={ addContact } className="w-full border-dashed">
              <Plus className="h-4 w-4 ml-2" />
              إضافة جهة اتصال
            </Button>
          </div>
        </FieldsSection>

        <FieldsSection title="معلومات إضافية" columns={ 1 }>
          <TextAreaField
            label="ملاحظات"
            value={ formData.notes || "" }
            onChange={ (e) => handleChange({ notes: e.target.value }) }
            rows={ 3 }
          />
        </FieldsSection>
      </FieldGroup>
    </ChangeDialog>
  );
}
