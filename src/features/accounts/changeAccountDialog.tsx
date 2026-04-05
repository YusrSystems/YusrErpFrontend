import { CityFilterColumns, type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps, IEntityState } from "@yusr_systems/ui";
import { Button, ChangeDialog, FieldGroup, FieldsSection, Input, NumberField, SearchableSelect, TextAreaField, TextField, useEntityForm } from "@yusr_systems/ui";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import Account, { AccountContact, AccountFilterColumns, AccountSlice, AccountType } from "../../core/data/account";
import { filterCities } from "../../core/state/shared/citySlice";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";

type AccountSliceType = ReturnType<typeof AccountSlice.create>;

export default function ChangeAccountDialog({
  entity,
  mode,
  service,
  onSuccess,
  slice,
  stateKey,
  fixedType
}: CommonChangeDialogProps<Account> & {
  slice: AccountSliceType;
  stateKey: keyof RootState;
  fixedType?: AccountType;
})
{
  const dispatch = useAppDispatch();
  const cityState = useAppSelector((state) => state.city);
  const accountState = useAppSelector((state) => state[stateKey] as IEntityState<Account>);

  const validationRules: ValidationRule<Partial<Account>>[] = useMemo(
    () => [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required("يرجى إدخال اسم الحساب")]
    }, {
      field: "type",
      selector: (d) => d.type,
      validators: [Validators.required("يرجى اختيار نوع الحساب")]
    }],
    []
  );

  const initialValues = useMemo(
    () => ({
      type: entity?.type || fixedType,
      ...entity,
      name: entity?.name || "",
      accountContacts: entity?.accountContacts || [new AccountContact()]
    }),
    [entity]
  );

  const { formData, handleChange, getError, isInvalid, validate } = useEntityForm<Account>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(filterCities(undefined));
    dispatch(slice.entityActions.filter(undefined));
  }, [dispatch]);

  const addContact = () =>
  {
    handleChange({
      accountContacts: [...(formData.accountContacts || []), new AccountContact()]
    });
  };

  const updateContact = (
    index: number,
    field: keyof AccountContact,
    value: any
  ) =>
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

  const isBank = formData?.type === AccountType.Bank;
  const isBox = formData?.type === AccountType.Box;
  const requiresTaxInfo = formData?.type === AccountType.Client
    || formData?.type === AccountType.Supplier
    || formData?.type === AccountType.Employee;
  const requiresAddress = !isBank;
  const requiresContacts = !isBank && !isBox;

  const getTypeName = () =>
  {
    switch (formData.type)
    {
      case AccountType.Client:
        return "عميل";
      case AccountType.Supplier:
        return "مورد";
      case AccountType.Employee:
        return "موظف";
      case AccountType.Bank:
        return "بنك";
      case AccountType.Box:
        return "صندوق";
    }
  };

  return (
    <ChangeDialog<Account>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} حساب ${getTypeName()}` }
      className="sm:max-w-4xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => cityState.isLoading || accountState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup className="gap-10">
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
              onValueChange={(val) =>
                handleChange({ type: Number(val) as AccountType })
              }
              isInvalid={isInvalid("type")}
              error={getError("type")}
              disabled={mode === "update"}
              options={[
                { label: "عميل", value: AccountType.Client.toString() },
                { label: "مورد", value: AccountType.Supplier.toString() },
                { label: "موظف", value: AccountType.Employee.toString() },
                { label: "بنك", value: AccountType.Bank.toString() },
                { label: "صندوق", value: AccountType.Box.toString() },
              ]}
            /> */
            }

            <NumberField
              label="الرصيد الافتتاحي"
              value={ formData.initialBalance || "" }
              onChange={ (val) => handleChange({ initialBalance: val }) }
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium">الحساب الأب</label>
              <SearchableSelect
                items={ accountState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                value={ formData.parentId?.toString() || "" }
                columnsNames={ AccountFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(slice.entityActions.filter(condition)) }
                disabled={ accountState.isLoading || mode === "update" }
                onValueChange={ (val) =>
                {
                  const selected = accountState.entities.data?.find(
                    (a) => a.id.toString() === val
                  );
                  handleChange({
                    parentId: selected?.id,
                    parentName: selected?.name
                  });
                } }
              />
            </div>
          </FieldsSection>

          { (requiresTaxInfo || isBank) && (
            <FieldsSection
              title={ isBank ? "المعلومات البنكية" : "المعلومات الضريبية والتجارية" }
              columns={ 2 }
            >
              { requiresTaxInfo && (
                <>
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
                </>
              ) }

              { isBank && (
                <TextField
                  label="رقم الحساب البنكي"
                  value={ formData.bankAccountNumber || "" }
                  onChange={ (e) => handleChange({ bankAccountNumber: e.target.value }) }
                  dir="ltr"
                />
              ) }
            </FieldsSection>
          ) }

          { (requiresAddress || requiresContacts) && (
            <div
              className={ `grid gap-6 ${
                requiresAddress && requiresContacts
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }` }
            >
              { requiresAddress && (
                <FieldsSection title="معلومات العنوان" columns={ 1 }>
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
                        const selected = cityState.entities.data?.find(
                          (c) => c.id.toString() === val
                        );
                        handleChange({ cityId: selected?.id, city: selected });
                      } }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
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
                  </div>
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
              ) }

              { requiresContacts && (
                <FieldsSection title="أرقام التواصل" columns={ 1 }>
                  <div className="relative flex flex-col max-h-50 border rounded-md">
                    <div className="space-y-3 overflow-y-auto p-3 flex-1">
                      { formData.accountContacts?.map((contact, index) => (
                        <div key={ index } className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              value={ contact.number || "" }
                              onChange={ (e) =>
                                updateContact(index, "number", e.target.value) }
                              placeholder="05xxxxxxxx"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="sticky"
                            onClick={ () =>
                              removeContact(index) }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )) }
                    </div>

                    <div className="sticky bottom-0 p-3 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={ addContact }
                        className="w-full border-dashed"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة رقم تواصل
                      </Button>
                    </div>
                  </div>
                </FieldsSection>
              ) }
            </div>
          ) }

          <FieldsSection title="معلومات إضافية" columns={ 1 }>
            <TextAreaField
              label="ملاحظات"
              value={ formData.notes || "" }
              onChange={ (e) => handleChange({ notes: e.target.value }) }
              rows={ 3 }
            />
          </FieldsSection>
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
