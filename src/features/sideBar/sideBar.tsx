import { ApiConstants, SystemPermissions, YusrApiHelper } from "@yusr_systems/core";
import { Sidebar, SideBarCompanyData, SidebarContent, SidebarFooter, SidebarHeader, SidebarLogo, SideBarMainMenu, SidebarMenu, SidebarMenuItem, SideBarSecondaryMenu, SideBarUserData } from "@yusr_systems/ui";
import { Building2Icon, DollarSignIcon, LayoutDashboardIcon, Percent, SettingsIcon, UsersIcon } from "lucide-react";
import * as React from "react";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import ApplicationLanguages from "../../core/services/language/applicationLanguages";
import { logout, useAppDispatch, useAppSelector } from "../../core/state/store";

import logoFullDark from "@/assets/yusrBusLogoRTL_Dark.png";
import logoFullLight from "@/assets/yusrBusLogoRTL_Light.png";
import logoOnlyDark from "@/assets/yusrLogoOnly_Dark.png";
import logoOnlyLight from "@/assets/yusrLogoOnly_Light.png";

const appLang = ApplicationLanguages.getAppLanguageText();
const appLangSections = appLang.sections;

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authState = useAppSelector((state) => state.auth);
  const permissions: string[] = authState.loggedInUser?.role?.permissions || [];

  const dispatch = useAppDispatch();

  const logoConfig = {
    full: { light: logoFullLight, dark: logoFullDark },
    collapsed: { light: logoOnlyLight, dark: logoOnlyDark },
  };

  const data = {
    navMain: [
      {
        title: appLangSections.dashboard,
        url: "/dashboard",
        icon: <LayoutDashboardIcon />,
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Dashboard,
          SystemPermissionsActions.Get,
        ),
      },
      {
        title: appLangSections.taxes,
        url: "/taxes",
        icon: <Percent />,
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Taxes,
          SystemPermissionsActions.Get,
        ),
      },
      {
        title: "الحسابات",
        url: "#",
        icon: <DollarSignIcon />,
        hasAuth: true,
        subItems: [{
          title: appLangSections.clients,
          url: "/clients",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Accounts,
            SystemPermissionsActions.Get
          )
        }, {
          title: appLangSections.suppliers,
          url: "/suppliers",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Accounts,
            SystemPermissionsActions.Get
          )
        }, {
          title: appLangSections.employees,
          url: "/employees",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Accounts,
            SystemPermissionsActions.Get
          )
        }, {
          title: appLangSections.banks,
          url: "/banks",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Accounts,
            SystemPermissionsActions.Get
          )
        }, {
          title: appLangSections.boxes,
          url: "/boxes",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Accounts,
            SystemPermissionsActions.Get
          )
        }, {
          title: appLangSections.paymentMethods,
          url: "/paymentMethods",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.PaymentMethods,
            SystemPermissionsActions.Get
          )
        }]
      },
      // --- NEW: Grouped Organization Items ---
      {
        title: "المؤسسة", // Replace with appLangSections.organization if available
        url: "#",
        icon: <Building2Icon />,
        hasAuth: true, // Parent auth is true, children will be filtered automatically by the updated component
        subItems: [{
          title: appLangSections.invoices,
          url: "/invoices",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Invoices,
            SystemPermissionsActions.Get
          )
        }, {
          title: appLangSections.stores,
          url: "/stores",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Stores,
            SystemPermissionsActions.Get
          )
        }, {
          title: appLangSections.units,
          url: "/units",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Units,
            SystemPermissionsActions.Get
          )
        }, {
          title: appLangSections.branches,
          url: "/branches",
          hasAuth: SystemPermissions.hasAuth(
            permissions,
            SystemPermissionsResources.Branches,
            SystemPermissionsActions.Get
          )
        }]
      },
      // --- NEW: Grouped User Management Items ---
      {
        title: "إدارة المستخدمين", // Replace with appLangSections.userManagement if available
        url: "#",
        icon: <UsersIcon />,
        hasAuth: true,
        subItems: [
          {
            title: appLangSections.users,
            url: "/users",
            hasAuth: SystemPermissions.hasAuth(
              permissions,
              SystemPermissionsResources.Users,
              SystemPermissionsActions.Get,
            ),
          },
          {
            title: appLangSections.roles,
            url: "/roles",
            hasAuth: SystemPermissions.hasAuth(
              permissions,
              SystemPermissionsResources.Roles,
              SystemPermissionsActions.Get,
            ),
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: appLangSections.settings,
        url: "/settings",
        icon: <SettingsIcon />,
      },
    ],
  };

  const displayCompany = {
    name: authState.setting?.companyName || "Default Name",
    logo: authState.setting?.logo?.url || "/default-avatar.jpg",
  };

  const LogoutHandler = async () => {
    const result = await YusrApiHelper.Post(`${ApiConstants.baseUrl}/Logout`);

    if (result.status === 200 || result.status === 204) {
      dispatch(logout());
    }
  };

  return (
    <Sidebar collapsible="icon" side="right" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarLogo logos={logoConfig} />
            <SideBarCompanyData company={displayCompany} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SideBarMainMenu items={data.navMain} />
        <SideBarSecondaryMenu
          items={data.navSecondary}
          className="pt-10 mt-auto text-center"
          onLogout={LogoutHandler}
        />
      </SidebarContent>

      <SidebarFooter>
        <SideBarUserData user={authState.loggedInUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
