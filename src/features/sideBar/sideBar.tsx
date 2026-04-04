import {
  ApiConstants,
  SystemPermissions,
  YusrApiHelper,
} from "@yusr_systems/core";
import {
  Sidebar,
  SideBarCompanyData,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarLogo,
  SideBarMainMenu,
  SidebarMenu,
  SidebarMenuItem,
  SideBarSecondaryMenu,
  SideBarUserData,
} from "@yusr_systems/ui";
import {
  Building2Icon,
  LayoutDashboardIcon,
  Percent,
  SettingsIcon,
  ShieldCheck,
  Store,
  UserCogIcon,
} from "lucide-react";
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
  console.log(permissions);

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
        title: appLangSections.stores,
        url: "/stores",
        icon: <Store />,
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Stores,
          SystemPermissionsActions.Get,
        ),
      },
      {
        title: appLangSections.branches,
        url: "/branches",
        icon: <Building2Icon />,
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Branches,
          SystemPermissionsActions.Get,
        ),
      },
      {
        title: appLangSections.users,
        url: "/users",
        icon: <UserCogIcon />,
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Users,
          SystemPermissionsActions.Get,
        ),
      },
      {
        title: appLangSections.roles,
        url: "/roles",
        icon: <ShieldCheck />,
        hasAuth: SystemPermissions.hasAuth(
          permissions,
          SystemPermissionsResources.Roles,
          SystemPermissionsActions.Get,
        ),
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
