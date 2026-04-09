import placeholderImg from "@/assets/placeholder.svg";
import { Button, Card, CardContent, cn, Field, FieldDescription, FieldGroup, PasswordField, SelectField, TextField } from "@yusr_systems/ui";
import { Loader2 } from "lucide-react";
import { use, useEffect } from "react";
import Registration from "../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import CompanyInfo from "./companyInfo";

type SelectOption = { id: number; name: string; };

export interface RegisterFormProps
{
  className?: string;
  formData: Partial<Registration>;
  loading?: boolean;
  currentStep?: number;
  cities?: SelectOption[];
  salesDelegates?: SelectOption[];
  errors?: Partial<Record<keyof Registration, string>>;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
  onLoginClick: () => void;
}

const STEPS = [{ label: "معلومات الشركة" }, { label: "العنوان" }, { label: "معلومات الحساب" }];

export function RegisterForm({
  className,
  formData,
  loading = false,
  currentStep = 0,
  cities = [],
  salesDelegates = [],
  errors = {},
  onNextStep,
  onPrevStep,
  onSubmit,
  onLoginClick,
  ...props
}: RegisterFormProps)
{
  const isLastStep = currentStep === STEPS.length - 1;
  const dispatch = useAppDispatch();
  return (
    <div className={ cn("flex flex-col gap-6", className) } { ...props }>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
                <p className="text-muted-foreground text-balance">أدخل بيانات شركتك للبدء</p>
              </div>

              <div className="flex items-center justify-between gap-2">
                { STEPS.map((step, index) => (
                  <div key={ index } className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={ cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                        index < currentStep && "border-primary bg-primary text-primary-foreground",
                        index === currentStep && "border-primary text-primary",
                        index > currentStep && "border-muted-foreground/30 text-muted-foreground/30"
                      ) }
                    >
                      { index + 1 }
                    </div>
                    <span
                      className={ cn(
                        "hidden text-xs md:block",
                        index === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                      ) }
                    >
                      { step.label }
                    </span>
                    { index < STEPS.length - 1 && (
                      <div
                        className={ cn(
                          "absolute hidden"
                        ) }
                      />
                    ) }
                  </div>
                )) }
              </div>

              { currentStep === 0 && <CompanyInfo /> }

              { currentStep === 1 && (
                <>
                  <SelectField
                    label="المدينة"
                    id="cityId"
                    value={ formData.cityId?.toString() || undefined }
                    isInvalid={ !!errors.cityId }
                    error={ errors.cityId }
                    onValueChange={ (val) => onFieldChange({ cityId: Number(val) }) }
                    required
                    options={ cities.map((c) => ({ label: c.name, value: c.id.toString() })) }
                  />

                  <TextField
                    label="الشارع"
                    id="street"
                    type="text"
                    placeholder="اسم الشارع"
                    value={ formData.street || "" }
                    isInvalid={ !!errors.street }
                    error={ errors.street }
                    onChange={ (e) => onFieldChange({ street: e.target.value }) }
                  />

                  <TextField
                    label="الحي"
                    id="district"
                    type="text"
                    placeholder="اسم الحي"
                    value={ formData.district || "" }
                    isInvalid={ !!errors.district }
                    error={ errors.district }
                    onChange={ (e) => onFieldChange({ district: e.target.value }) }
                  />

                  <TextField
                    label="رقم المبنى"
                    id="buildingNumber"
                    type="text"
                    placeholder="رقم المبنى"
                    value={ formData.buildingNumber || "" }
                    isInvalid={ !!errors.buildingNumber }
                    error={ errors.buildingNumber }
                    onChange={ (e) => onFieldChange({ buildingNumber: e.target.value }) }
                  />

                  <TextField
                    label="الرمز البريدي"
                    id="postalCode"
                    type="text"
                    placeholder="الرمز البريدي"
                    value={ formData.postalCode || "" }
                    isInvalid={ !!errors.postalCode }
                    error={ errors.postalCode }
                    onChange={ (e) => onFieldChange({ postalCode: e.target.value }) }
                  />
                </>
              ) }

              { currentStep === 2 && (
                <>
                  <TextField
                    label="البريد الإلكتروني للشركة"
                    id="email"
                    type="email"
                    placeholder="company@example.com"
                    value={ formData.email || "" }
                    isInvalid={ !!errors.email }
                    error={ errors.email }
                    onChange={ (e) => onFieldChange({ email: e.target.value }) }
                    required
                  />

                  <PasswordField
                    label="كلمة مرور الشركة"
                    id="password"
                    placeholder="••••••••"
                    value={ formData.password || "" }
                    isInvalid={ !!errors.password }
                    error={ errors.password }
                    onChange={ (e) => onFieldChange({ password: e.target.value }) }
                    required
                  />

                  <TextField
                    label="اسم المستخدم"
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={ formData.username || "" }
                    isInvalid={ !!errors.username }
                    error={ errors.username }
                    onChange={ (e) => onFieldChange({ username: e.target.value }) }
                    required
                  />

                  <PasswordField
                    label="كلمة مرور المستخدم"
                    id="userPassword"
                    placeholder="••••••••"
                    value={ formData.userPassword || "" }
                    isInvalid={ !!errors.userPassword }
                    error={ errors.userPassword }
                    onChange={ (e) => onFieldChange({ userPassword: e.target.value }) }
                    required
                  />

                  <SelectField
                    label="مندوب المبيعات (اختياري)"
                    value={ formData.salesDelegateId?.toString() || "none" }
                    isInvalid={ !!errors.salesDelegateId }
                    error={ errors.salesDelegateId }
                    onValueChange={ (val) =>
                      onFieldChange({ salesDelegateId: val === "none" ? undefined : Number(val) }) }
                    options={ [
                      { label: "بدون مندوب", value: "none" },
                      ...salesDelegates.map((s) => ({ label: s.name, value: s.id.toString() }))
                    ] }
                  />
                </>
              ) }

              <div className={ cn("flex gap-2", currentStep > 0 ? "justify-between" : "justify-end") }>
                { currentStep > 0 && (
                  <Field className="flex-1">
                    <Button type="button" variant="outline" onClick={ onPrevStep } disabled={ loading }>
                      السابق
                    </Button>
                  </Field>
                ) }
                <Field className="flex-1">
                  <Button
                    type="button"
                    disabled={ loading }
                    onClick={ isLastStep ? onSubmit : onNextStep }
                  >
                    { loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
                    { isLastStep ? "إنشاء الحساب" : "التالي" }
                  </Button>
                </Field>
              </div>

              <FieldDescription className="text-center">
                لديك حساب بالفعل؟{" "}
                <a
                  href="#"
                  onClick={ (e) =>
                  {
                    e.preventDefault();
                    onLoginClick();
                  } }
                >
                  سجل الدخول
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={ placeholderImg }
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
