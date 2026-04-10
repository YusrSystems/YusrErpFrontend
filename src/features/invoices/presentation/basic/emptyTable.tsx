export default function EmptyTable()
{
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-background/50">
      <p>لا توجد مواد مضافة حالياً.</p>
      <p className="text-xs mt-1">قم باختيار مادة من القائمة أو باستخدام الباركود لإضافتها للجدول.</p>
    </div>
  );
}
