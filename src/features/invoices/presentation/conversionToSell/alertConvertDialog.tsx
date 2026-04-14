import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button } from "@yusr_systems/ui";

type AlertConvertDialogProps = {
  showConfirm: boolean;
  setShowConfirm: (open: boolean) => void;
  convertToSell: (ignoreWarnings?: boolean) => void;
  warnings: string[];
  showWarnings: boolean;
  setShowWarnings: (open: boolean) => void;
};

export default function AlertConvertDialog({
  showConfirm,
  setShowConfirm,
  convertToSell,
  warnings,
  showWarnings,
  setShowWarnings
}: AlertConvertDialogProps)
{
  return (
    <>
      { /* Confirm Dialog */ }
      <AlertDialog open={ showConfirm } onOpenChange={ setShowConfirm }>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">تحويل لفاتورة بيع</Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد التحويل</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من تحويل عرض السعر إلى فاتورة بيع؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={ () => convertToSell(false) }>تأكيد</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      { /* Warnings Dialog */ }
      <AlertDialog open={ showWarnings } onOpenChange={ setShowWarnings }>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تحذيرات الفاتورة الإلكترونية</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <ul className="mt-2 space-y-1 text-sm text-right">
                { warnings.map((w, i) => <li key={ i } className="text-orange-600">• { w }</li>) }
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={ () => convertToSell(true) }>
              تجاهل التحذيرات وتحويل
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
