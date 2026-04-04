import { Card, CardContent, CardHeader, Checkbox, Label } from "@yusr_systems/ui";
import { ShieldCheck } from "lucide-react";

interface PermissionCardProps
{
  resourceId: string;
  label: string;
  masterPermission?: string | null;
  actions: { id: string; label: string; icon?: React.ReactNode; }[];
  selectedPermissions: string[];
  onToggle: (updated: string[]) => void;
  isMasterRequired?: boolean;
}

export interface PermissionGroup
{
  resource: string;
  get: string | null;
  actions: string[];
}

export const categorizePermissions = (systemPermissions: string[], order: string[]): PermissionGroup[] =>
{
  const groups = systemPermissions.reduce((acc, perm) =>
  {
    const [resource, action] = perm.split(":");
    if (!acc[resource])
    {
      acc[resource] = { get: null, actions: [] };
    }
    if (action === "Get")
    {
      acc[resource].get = perm;
    }
    else
    {
      acc[resource].actions.push(perm);
    }
    return acc;
  }, {} as Record<string, { get: string | null; actions: string[]; }>);

  return order.filter((key) => groups[key]).map((key) => ({ resource: key, ...groups[key] }));
};

export function PermissionCard(
  { resourceId, label, masterPermission, actions, selectedPermissions, onToggle, isMasterRequired = false }:
    PermissionCardProps
)
{
  const hasMaster = isMasterRequired ? true : masterPermission ? selectedPermissions.includes(masterPermission) : false;

  const toggleGetPermission = (currentPermissions: string[], resource: string, getPerm: string): string[] =>
  {
    const isActive = currentPermissions.includes(getPerm);
    return isActive
      ? currentPermissions.filter((p) => !p.startsWith(`${resource}:`))
      : [...currentPermissions, getPerm];
  };

  const toggleActionPermission = (currentPermissions: string[], perm: string): string[] =>
  {
    return currentPermissions.includes(perm)
      ? currentPermissions.filter((p) => p !== perm)
      : [...currentPermissions, perm];
  };

  return (
    <Card className="shadow-none border-2">
      <CardHeader className="flex flex-row items-center justify-between border-b py-3 px-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">{ label }</span>
        </div>
        { masterPermission && !isMasterRequired && (
          <Checkbox
            checked={ hasMaster }
            onCheckedChange={ () => onToggle(toggleGetPermission(selectedPermissions, resourceId, masterPermission)) }
          />
        ) }
      </CardHeader>
      <CardContent className="p-2 space-y-1">
        { actions.map((action) => (
          <div
            key={ action.id }
            className={ `flex items-center justify-between p-2 rounded-sm transition-opacity ${
              !hasMaster ? "opacity-40 select-none" : "hover:bg-muted"
            }` }
          >
            <div className="flex items-center gap-3">
              { action.icon }
              <Label className="text-xs cursor-pointer">{ action.label }</Label>
            </div>
            <Checkbox
              disabled={ !hasMaster }
              checked={ selectedPermissions.includes(action.id) }
              onCheckedChange={ () => onToggle(toggleActionPermission(selectedPermissions, action.id)) }
            />
          </div>
        )) }
      </CardContent>
    </Card>
  );
}
