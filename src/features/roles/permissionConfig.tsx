import { Database, FileBarChart, LayoutDashboard, Pencil, Plus, ShoppingCart, Trash2, Wallet } from "lucide-react";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";

export const ArabicLabels: Record<string, string> = {
  // Resources
  [SystemPermissionsResources.Branches]: "الفروع",
  [SystemPermissionsResources.Settings]: "الإعدادات",
  [SystemPermissionsResources.Users]: "المستخدمين",
  [SystemPermissionsResources.Roles]: "الأدوار",
  [SystemPermissionsResources.Dashboard]: "لوحة التحكم",
  [SystemPermissionsResources.Invoices]: "الفواتير",
  [SystemPermissionsResources.Vouchers]: "السندات",
  [SystemPermissionsResources.Accounts]: "الحسابات",
  [SystemPermissionsResources.BalanceTransfers]: "تحويلات الرصيد",
  [SystemPermissionsResources.PaymentMethods]: "طرق الدفع",
  [SystemPermissionsResources.Items]: "المواد",
  [SystemPermissionsResources.ItemTransfers]: "تحويلات المواد",
  [SystemPermissionsResources.ItemsSettlements]: "تسويات المواد",
  [SystemPermissionsResources.Stocktakings]: "الجرد",
  [SystemPermissionsResources.Units]: "الوحدات",
  [SystemPermissionsResources.PricingMethods]: "طرق التسعير",
  [SystemPermissionsResources.Stores]: "المخازن",
  [SystemPermissionsResources.Taxes]: "الضرائب",
  [SystemPermissionsResources.Obligations]: "الالتزامات",
  [SystemPermissionsResources.PosTerminals]: "نقاط البيع",

  // Invoice Permission Settings
  [SystemPermissionsResources.InvoiceAddSettlement]: "إضافة تسوية للفاتورة",
  [SystemPermissionsResources.InvoiceShowProfit]: "عرض ربح الفاتورة",
  [SystemPermissionsResources.InvoiceShowItemProfit]: "عرض ربح المادة في الفاتورة",
  [SystemPermissionsResources.InvoiceSellBelowSellingPrice]: "البيع بسعر أقل من سعر البيع",
  [SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity]: "البيع بكمية أكثر من الكمية المتوفرة",

  // Allowed Invoice Types
  [SystemPermissionsResources.InvoiceSell]: "فاتورة بيع",
  [SystemPermissionsResources.InvoicePurchase]: "فاتورة شراء",

  // Allowed Account Types
  [SystemPermissionsResources.AccountShowBalance]: "عرض الرصيد",
  [SystemPermissionsResources.AccountClient]: "حساب عميل",
  [SystemPermissionsResources.AccountSupplier]: "حساب مورد",
  [SystemPermissionsResources.AccountEmployee]: "حساب موظف",
  [SystemPermissionsResources.AccountBank]: "حساب بنك",
  [SystemPermissionsResources.AccountBox]: "حساب صندوق",

  // Report Permissions
  [SystemPermissionsResources.ReportInvoice]: "تقرير الفاتورة",
  [SystemPermissionsResources.ReportInvoiceList]: "تقرير قائمة الفواتير",
  [SystemPermissionsResources.ReportVoucher]: "تقرير السند",
  [SystemPermissionsResources.ReportVoucherList]: "تقرير قائمة السندات",
  [SystemPermissionsResources.ReportAccountStatement]: "تقرير كشف حساب",
  [SystemPermissionsResources.ReportAccountList]: "تقرير قائمة الحسابات",
  [SystemPermissionsResources.ReportBalanceTransfer]: "تقرير نقل رصيد",
  [SystemPermissionsResources.ReportItemStatement]: "تقرير كشف مادة",
  [SystemPermissionsResources.ReportItemList]: "تقرير قائمة المواد",
  [SystemPermissionsResources.ReportItemMovement]: "تقرير حركة المواد",
  [SystemPermissionsResources.ReportItemTaxStatement]: "تقرير كشف ضريبة مادة",
  [SystemPermissionsResources.ReportItemTransfer]: "تقرير نقل مادة",
  [SystemPermissionsResources.ReportBalanceSheet]: "تقرير الميزانية العمومية",
  [SystemPermissionsResources.ReportTaxReturn]: "تقرير الإقرار الضريبي",
  [SystemPermissionsResources.ReportProfitAndLoss]: "تقرير الربح والخسارة",
  [SystemPermissionsResources.ReportStocktaking]: "تقرير جرد المواد",
  [SystemPermissionsResources.ReportItemSettlement]: "تقرير تسوية المواد",
  [SystemPermissionsResources.ReportItemBarcode]: "تقرير باركود المواد",

  // Actions
  [SystemPermissionsActions.Add]: "إضافة",
  [SystemPermissionsActions.Update]: "تعديل",
  [SystemPermissionsActions.Delete]: "حذف"
};

export const ActionIcons: Record<string, React.ReactNode> = {
  [SystemPermissionsActions.Add]: <Plus className="w-4 h-4 text-blue-500" />,
  [SystemPermissionsActions.Update]: <Pencil className="w-4 h-4 text-orange-500" />,
  [SystemPermissionsActions.Delete]: <Trash2 className="w-4 h-4 text-red-500" />
};

export const PERMISSION_SECTIONS = [{
  id: "tables",
  title: "بيانات النظام الأساسية",
  icon: <Database className="w-5 h-5" />,
  resources: [
    SystemPermissionsResources.Invoices,
    SystemPermissionsResources.Vouchers,
    SystemPermissionsResources.Accounts,
    SystemPermissionsResources.BalanceTransfers,
    SystemPermissionsResources.PaymentMethods,
    SystemPermissionsResources.Items,
    SystemPermissionsResources.ItemTransfers,
    SystemPermissionsResources.ItemsSettlements,
    SystemPermissionsResources.Stocktakings,
    SystemPermissionsResources.Units,
    SystemPermissionsResources.PricingMethods,
    SystemPermissionsResources.Stores,
    SystemPermissionsResources.Taxes,
    SystemPermissionsResources.Users,
    SystemPermissionsResources.Roles,
    SystemPermissionsResources.Branches,
    SystemPermissionsResources.PosTerminals,
    SystemPermissionsResources.Obligations
  ]
}, {
  id: "system",
  title: "الإعدادات والتحكم",
  icon: <LayoutDashboard className="w-5 h-5" />,
  resources: [SystemPermissionsResources.Settings, SystemPermissionsResources.Dashboard]
}, {
  id: "invoices",
  title: "صلاحيات الفواتير",
  icon: <ShoppingCart className="w-5 h-5" />,
  resources: [
    SystemPermissionsResources.InvoiceAddSettlement,
    SystemPermissionsResources.InvoiceShowProfit,
    SystemPermissionsResources.InvoiceShowItemProfit,
    SystemPermissionsResources.InvoiceSellBelowSellingPrice,
    SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity,
    SystemPermissionsResources.InvoiceSell,
    SystemPermissionsResources.InvoicePurchase
  ]
}, {
  id: "accounts",
  title: "صلاحيات الحسابات",
  icon: <Wallet className="w-5 h-5" />,
  resources: [
    SystemPermissionsResources.AccountShowBalance,
    SystemPermissionsResources.AccountClient,
    SystemPermissionsResources.AccountSupplier,
    SystemPermissionsResources.AccountEmployee,
    SystemPermissionsResources.AccountBank,
    SystemPermissionsResources.AccountBox
  ]
}, {
  id: "reports",
  title: "تقارير النظام",
  icon: <FileBarChart className="w-5 h-5" />,
  resources: [
    SystemPermissionsResources.ReportInvoice,
    SystemPermissionsResources.ReportInvoiceList,
    SystemPermissionsResources.ReportVoucher,
    SystemPermissionsResources.ReportVoucherList,
    SystemPermissionsResources.ReportAccountStatement,
    SystemPermissionsResources.ReportAccountList,
    SystemPermissionsResources.ReportBalanceTransfer,
    SystemPermissionsResources.ReportItemStatement,
    SystemPermissionsResources.ReportItemList,
    SystemPermissionsResources.ReportItemMovement,
    SystemPermissionsResources.ReportItemTaxStatement,
    SystemPermissionsResources.ReportItemTransfer,
    SystemPermissionsResources.ReportBalanceSheet,
    SystemPermissionsResources.ReportTaxReturn,
    SystemPermissionsResources.ReportProfitAndLoss,
    SystemPermissionsResources.ReportStocktaking,
    SystemPermissionsResources.ReportItemSettlement,
    SystemPermissionsResources.ReportItemBarcode
  ]
}];
