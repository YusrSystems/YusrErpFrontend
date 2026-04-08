import { StorageFileStatus } from "@yusr_systems/core";
import { Avatar, AvatarFallback, AvatarImage, Button, FieldGroup, FieldsSection, Label, TextField, useStorageFile } from "@yusr_systems/ui";
import { differenceInDays, format } from "date-fns";
import { Camera, Trash2, Upload } from "lucide-react";
import type { Setting } from "../../core/data/setting";
import { useSettingContext } from "./settingContext";

export default function BasicSection()
{
  const {
    formData,
    handleChange,
    isInvalid,
    getError,
    clearError
  } = useSettingContext();

  const { fileInputRef, handleFileChange, handleRemoveFile } = useStorageFile<Partial<Setting>>(handleChange, "logo");

  return (
    <div className="space-y-5 animate-in fade-in">
      { /* LOGO SECTION */ }
      <div className="flex flex-col md:flex-row items-center gap-6 p-3 rounded-xl border bg-muted/10">
        <Avatar className="h-32 w-32 border-4 border-background shadow-md">
          <AvatarImage
            src={ formData.logo?.status !== StorageFileStatus.Delete ? formData.logo?.url || "" : "" }
            className="object-cover bg-white"
          />
          <AvatarFallback className="bg-secondary">
            <Camera className="h-10 w-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-3 text-center md:text-right">
          <h3 className="text-lg font-bold">شعار الشركة</h3>
          <p className="text-sm text-muted-foreground">سيظهر هذا الشعار في الفواتير والتقارير المطبوعة.</p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
            { (formData.logo?.url == undefined || formData.logo.status === StorageFileStatus.Delete) && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={ () => fileInputRef.current?.click() }
              >
                <Upload className="h-4 w-4 ml-2" /> رفع صورة
              </Button>
            ) }

            { formData.logo?.url && formData.logo.status !== StorageFileStatus.Delete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={ () => handleRemoveFile(0) }
              >
                <Trash2 className="h-4 w-4 ml-2" /> حذف
              </Button>
            ) }
          </div>
          <p className="text-xs text-muted-foreground">PNG أو JPG — الحد الأقصى 2MB</p>
          <input
            type="file"
            ref={ fileInputRef }
            className="hidden"
            aria-label="تحميل شعار الشركة"
            accept="image/*"
            onChange={ handleFileChange }
          />
        </div>
      </div>

      { /* BASIC INFO */ }
      <FieldGroup>
        <FieldsSection title="البيانات الأساسية" columns={ 2 }>
          <TextField
            label="اسم الشركة"
            required
            value={ formData.companyName || "" }
            isInvalid={ isInvalid("companyName") }
            error={ getError("companyName") }
            onChange={ (e) =>
            {
              handleChange({ companyName: e.target.value });
              clearError("companyName");
            } }
          />
          <TextField
            label="مجال العمل (النشاط)"
            value={ formData.companyBusinessCategory || "" }
            onChange={ (e) => handleChange({ companyBusinessCategory: e.target.value }) }
          />
          <TextField
            label="رقم الهاتف"
            required
            value={ formData.companyPhone || "" }
            isInvalid={ isInvalid("companyPhone") }
            error={ getError("companyPhone") }
            onChange={ (e) =>
            {
              handleChange({ companyPhone: e.target.value });
              clearError("companyPhone");
            } }
          />
          <TextField
            label="البريد الإلكتروني"
            required
            type="email"
            value={ formData.email || "" }
            isInvalid={ isInvalid("email") }
            error={ getError("email") }
            onChange={ (e) =>
            {
              handleChange({ email: e.target.value });
              clearError("email");
            } }
          />
          <TextField
            label="السجل التجاري (CRN)"
            value={ formData.crn || "" }
            onChange={ (e) => handleChange({ crn: e.target.value }) }
          />
          <TextField
            label="الرقم الضريبي (VAT)"
            value={ formData.vatNumber || "" }
            onChange={ (e) => handleChange({ vatNumber: e.target.value }) }
          />
        </FieldsSection>
      </FieldGroup>

      { /* SUBSCRIPTION */ }
      <div className="space-y-4 animate-in fade-in">
        <h3 className="text-lg font-semibold">تفاصيل الاشتراك</h3>
        <div className="grid md:grid-cols-3 gap-4 p-5 rounded-xl border bg-linear-to-br from-muted/40 to-muted/20 shadow-sm">
          { /* START DATE */ }
          <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
            <Label className="text-xs text-muted-foreground">تاريخ البدء</Label>
            <p className="text-lg font-semibold tracking-wide text-primary">
              { formData.startDate ? format(new Date(formData.startDate), "dd/MM/yyyy") : "-" }
            </p>
          </div>

          { /* END DATE */ }
          <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
            <Label className="text-xs text-muted-foreground">تاريخ الانتهاء</Label>
            <p className="text-lg font-semibold tracking-wide text-primary">
              { formData.endDate ? format(new Date(formData.endDate), "dd/MM/yyyy") : "-" }
            </p>
          </div>

          { /* TIME LEFT */ }
          <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
            <Label className="text-xs text-muted-foreground">المدة المتبقية</Label>

            { formData.endDate
              ? (() =>
              {
                const daysLeft = differenceInDays(new Date(formData.endDate), new Date());

                const statusColor = daysLeft > 10
                  ? "text-green-600 dark:text-green-400"
                  : daysLeft > 0
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400";

                const bgColor = daysLeft > 10
                  ? "bg-green-50 dark:bg-green-950/30"
                  : daysLeft > 0
                  ? "bg-yellow-50 dark:bg-yellow-950/30"
                  : "bg-red-50 dark:bg-red-950/30";

                return (
                  <p
                    className={ `text-lg font-bold px-2 py-1 rounded-md inline-block w-fit ${statusColor} ${bgColor}` }
                  >
                    { daysLeft > 0 ? `متبقي ${daysLeft} يوم` : "منتهي" }
                  </p>
                );
              })()
              : "-" }
          </div>
        </div>
      </div>
    </div>
  );
}
