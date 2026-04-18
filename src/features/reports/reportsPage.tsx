import { SystemPermissions } from "@yusr_systems/core";
import { ArrowRightLeft, BarChart2, FileText, type LucideIcon, Percent, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { ClientsAndSuppliersSlice } from "../../core/data/account";
import { ItemSlice } from "../../core/data/item";
import { StoreSlice } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import BalanceSheetDialog from "./BalanceSheetDialog";
import ItemsMovementDialog from "./ItemsMovementDialog";
import ItemsTaxStatementDialog from "./ItemsTaxStatementDialog";
import ProfitAndLossDialog from "./ProfitAndLossDialog";
import TaxReturnDialog from "./TaReturnDialog";

interface Report
{
  comp: React.ReactNode;
  name: string;
  description: string;
  icon: LucideIcon;
  hasAuth: boolean;
}

interface ReportGroup
{
  label: string;
  icon: LucideIcon;
  iconColor: string;
  reports: Report[];
}

interface ReportCardProps
{
  report: Report;
  groupIconColor: string;
}

function ReportCard({ report, groupIconColor }: ReportCardProps)
{
  const Icon = report.icon;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-accent/30">
      <div className={ `flex h-9 w-9 items-center justify-center rounded-lg` }>
        <Icon className={ `h-5 w-5 ${groupIconColor}` } strokeWidth={ 1.8 } />
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-foreground">{ report.name }</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{ report.description }</p>
      </div>

      { report.comp }
    </div>
  );
}

interface ReportGroupSectionProps
{
  group: ReportGroup;
}

function ReportGroupSection({ group }: ReportGroupSectionProps)
{
  const GroupIcon = group.icon;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className={ "flex h-7 w-7 items-center justify-center rounded-lg" }>
          <GroupIcon className={ `h-5 w-5 ${group.iconColor}` } strokeWidth={ 1.8 } />
        </div>
        <h2 className="text-sm font-medium text-foreground">{ group.label }</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        { group.reports.map((report, i) => (
          report.hasAuth
            ? (
              <ReportCard
                key={ i }
                report={ report }
                groupIconColor={ group.iconColor }
              />
            )
            : null
        )) }
      </div>
    </section>
  );
}

export default function ReportsPage()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  useEffect(() =>
  {
    dispatch(ItemSlice.entityActions.filter());
    dispatch(StoreSlice.entityActions.filter());
    dispatch(ClientsAndSuppliersSlice.entityActions.filter());
  }, []);

  const reportGroups: ReportGroup[] = [{
    label: "مالي",
    icon: BarChart2,
    iconColor: "text-blue-600",
    reports: [{
      comp: <BalanceSheetDialog />,
      name: "الميزانية العمومية",
      description: "الأصول والخصوم وحقوق الملكية",
      icon: FileText,
      hasAuth: SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ReportBalanceSheet,
        SystemPermissionsActions.Get
      )
    }, {
      comp: <ProfitAndLossDialog />,
      name: "الأرباح والخسائر",
      description: "الإيرادات والمصروفات وصافي الربح",
      icon: TrendingUp,
      hasAuth: SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ReportProfitAndLoss,
        SystemPermissionsActions.Get
      )
    }]
  }, {
    label: "ضريبي",
    icon: Percent,
    iconColor: "text-amber-600",
    reports: [{
      comp: <TaxReturnDialog />,
      name: "الإقرار الضريبي",
      description: "تقرير ضريبة القيمة المضافة الدوري",
      icon: FileText,
      hasAuth: SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ReportTaxReturn,
        SystemPermissionsActions.Get
      )
    }, {
      comp: <ItemsTaxStatementDialog />,
      name: "كشف ضريبة المواد",
      description: "تفاصيل الضريبة لكل مادة",
      icon: Percent,
      hasAuth: SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ReportItemTaxStatement,
        SystemPermissionsActions.Get
      )
    }]
  }, {
    label: "مخزون",
    icon: ArrowRightLeft,
    iconColor: "text-green-700",
    reports: [{
      comp: <ItemsMovementDialog />,
      name: "حركة المواد",
      description: "حركات المخزون للمواد",
      icon: ArrowRightLeft,
      hasAuth: SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ReportItemMovement,
        SystemPermissionsActions.Get
      )
    }]
  }];

  return (
    <div dir="rtl" className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-xl font-medium text-foreground">التقارير</h1>
        <p className="mt-1 text-sm text-muted-foreground">إنشاء وتصدير تقارير الأعمال</p>
      </div>

      { reportGroups.map((group) => (
        <ReportGroupSection
          key={ group.label }
          group={ group }
        />
      )) }
    </div>
  );
}
