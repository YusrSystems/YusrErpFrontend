import { Database, FileBarChart, LayoutDashboard, Pencil, Plus, Trash2 } from "lucide-react";
import { SystemPermissionsActions } from "../../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";

export const ArabicLabels: Record<string, string> = {
  [SystemPermissionsResources.Branches]: "الفروع",
  [SystemPermissionsResources.Settings]: "الإعدادات",
  [SystemPermissionsResources.Users]: "المستخدمين",
  [SystemPermissionsResources.Roles]: "الأدوار",
  [SystemPermissionsResources.Dashboard]: "لوحة التحكم",
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
  resources: [SystemPermissionsResources.Branches, SystemPermissionsResources.Roles, SystemPermissionsResources.Users]
}, {
  id: "system",
  title: "الإعدادات والتحكم",
  icon: <LayoutDashboard className="w-5 h-5" />,
  resources: [SystemPermissionsResources.Settings, SystemPermissionsResources.Dashboard]
}, {
  id: "reports",
  title: "تقارير النظام",
  icon: <FileBarChart className="w-5 h-5" />,
  resources: []
}];
