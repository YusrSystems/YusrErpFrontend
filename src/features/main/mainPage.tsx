import { SideBar } from "@/app/core/components/sideBar/sideBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@yusr_systems/ui";
import { Outlet } from "react-router-dom";

const MainPage = () =>
{
  return (
    <SidebarProvider>
      <SideBar variant="inset" />
      <SidebarInset>
        <header className="flex h-[--header-height] items-center gap-4 p-4">
          <SidebarTrigger />
        </header>

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainPage;
