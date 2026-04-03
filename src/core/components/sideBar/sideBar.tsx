import { ApiConstants, SystemPermissions, YusrApiHelper } from "@yusr_systems/core";
import { Sidebar, SideBarCompanyData, SidebarContent, SidebarFooter, SidebarHeader, SidebarLogo, SideBarMainMenu, SidebarMenu, SidebarMenuItem, SideBarSecondaryMenu, SideBarUserData } from "@yusr_systems/ui";
import { Building2Icon, BusFrontIcon, LayoutDashboardIcon, MapPinnedIcon, SettingsIcon, ShieldCheck, UserCogIcon, UsersIcon } from "lucide-react";
import * as React from "react";
import { SystemPermissionsActions } from "../../auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import ApplicationLang from "../../services/langService/applicationLang";
import { logout, useAppDispatch, useAppSelector } from "../../state/store";

import logoFullDark from "@/assets/yusrBusLogoRTL_Dark.png";
import logoFullLight from "@/assets/yusrBusLogoRTL_Light.png";
import logoOnlyDark from "@/assets/yusrLogoOnly_Dark.png";
import logoOnlyLight from "@/assets/yusrLogoOnly_Light.png";

const appLang = ApplicationLang.getAppLangText();
const appLangSections = appLang.sections;

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
  const authState = useAppSelector((state) => state.auth);
  const permissions: string[] = authState.loggedInUser?.role?.permissions || [];
  const dispatch = useAppDispatch();

  const logoConfig = {
    full: { light: logoFullLight, dark: logoFullDark },
    collapsed: { light: logoOnlyLight, dark: logoOnlyDark }
  };

  const data = {
    navMain: [{
      title: appLangSections.dashboard,
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      hasAuth: SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.Dashboard,
        SystemPermissionsActions.Get
      )
    }, {
      title: appLangSections.trips,
      url: "/trips",
      icon: <BusFrontIcon />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Trips, SystemPermissionsActions.Get)
    }, {
      title: appLangSections.passengers,
      url: "/passengers",
      icon: <UsersIcon />,
      hasAuth: SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.Passengers,
        SystemPermissionsActions.Get
      )
    }, {
      title: appLangSections.routes,
      url: "/routes",
      icon: <MapPinnedIcon />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Routes, SystemPermissionsActions.Get)
    }, {
      title: appLangSections.branches,
      url: "/branches",
      icon: <Building2Icon />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Branches, SystemPermissionsActions.Get)
    }, {
      title: appLangSections.users,
      url: "/users",
      icon: <UserCogIcon />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Users, SystemPermissionsActions.Get)
    }, {
      title: appLangSections.roles,
      url: "/roles",
      icon: <ShieldCheck />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Roles, SystemPermissionsActions.Get)
    }],
    navSecondary: [{ title: appLangSections.settings, url: "/settings", icon: <SettingsIcon /> }]
  };

  const displayCompany = {
    name: authState.setting?.companyName || "Default Name",
    logo: authState.setting?.logo?.url || "/default-avatar.jpg"
  };

  const LogoutHandler = async () =>
  {
    const result = await YusrApiHelper.Post(`${ApiConstants.baseUrl}/Logout`);

    if (result.status === 200 || result.status === 204)
    {
      dispatch(logout());
    }
  };

  return (
    <Sidebar collapsible="icon" side="right" { ...props }>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarLogo logos={ logoConfig } />

            <SideBarCompanyData company={ displayCompany } />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SideBarMainMenu items={ data.navMain } />
        <SideBarSecondaryMenu
          items={ data.navSecondary }
          className="pt-10 mt-auto text-center"
          onLogout={ LogoutHandler }
        />
      </SidebarContent>
      <SidebarFooter>
        <SideBarUserData user={ authState.loggedInUser } />
      </SidebarFooter>
    </Sidebar>
  );
}
