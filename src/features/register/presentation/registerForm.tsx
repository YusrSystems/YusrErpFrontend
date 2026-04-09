import placeholderImg from "@/assets/placeholder.svg";
import { Button, Card, CardContent, cn, Field, FieldDescription, FieldGroup } from "@yusr_systems/ui";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "../../../core/state/store";
import AccountInfo from "./feildsInfo/accountInfo";
import AddressInfo from "./feildsInfo/addressInfo";
import CompanyInfo from "./feildsInfo/companyInfo";

export interface RegisterFormProps
{
  className?: string;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
  onLoginClick: () => void;
}

const STEPS = [{ label: "معلومات الشركة" }, { label: "العنوان" }, { label: "معلومات الحساب" }];

export function RegisterForm({
  className,
  onNextStep,
  onPrevStep,
  onSubmit,
  onLoginClick,
  ...props
}: RegisterFormProps)
{
  const { loading, currentStep } = useAppSelector((state) => state.register);

  const isLastStep = currentStep === STEPS.length - 1;
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

              { currentStep === 1 && <AddressInfo /> }

              { currentStep === 2 && <AccountInfo /> }

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
