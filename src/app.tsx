import { ProtectedRoute, Skeleton, ThemeProvider, Toaster, TooltipProvider } from "@yusr_systems/ui";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAppInitialization from "./core/hooks/useAppInitialization";
import RoutesService from "./core/services/constants/routesService";
import { useAppSelector } from "./core/state/store";
import BranchesPage from "./features/branches/presentation/branchesPage";
import DashboardPage from "./features/dashboard/dashboardPage";
import LandingPage from "./features/landing/landingPage";
import LoginPage from "./features/login/loginPage";
import MainPage from "./features/main/mainPage";
import NotFoundPage from "./features/notFound/notFoundPage";
import PassengersPage from "./features/passengers/presentation/passengersPage";
import PrfilePage from "./features/profile/prfilePage";
import TicketRedirect from "./features/redirection/ticketRedirect";
import RolesPage from "./features/roles/presentation/rolesPage";
import RoutesPage from "./features/routes/presentation/routesPage";
import SettingPage from "./features/setting/settingPage";
import TripsPage from "./features/trips/presentation/tripsPage";
import UsersPage from "./features/users/presentation/usersPage";

function App()
{
  const { isLoading } = useAppInitialization();

  if (isLoading)
  {
    return <Apploading />;
  }

  return <AppBody />;
}

function AppBody()
{
  return (
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <AppRoutes />
        <Toaster richColors closeButton position="top-center" dir="rtl" />
      </ThemeProvider>
    </TooltipProvider>
  );
}

function Apploading()
{
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

function AppRoutes()
{
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/login" element={ <LoginPage /> } />

        <Route path="/t/:accessKey" element={ <TicketRedirect /> } />

        <Route element={ <ProtectedRoute isAuthenticated={ isAuthenticated } /> }>
          <Route element={ <MainPage /> }>
            <Route path="/dashboard" element={ <DashboardPage /> } />
            <Route path="/trips" element={ <TripsPage /> } />
            <Route path="/passengers" element={ <PassengersPage /> } />
            <Route path="/routes" element={ <RoutesPage /> } />
            <Route path="/branches" element={ <BranchesPage /> } />
            <Route path="/users" element={ <UsersPage /> } />
            <Route path="/settings" element={ <SettingPage /> } />
            <Route path="/roles" element={ <RolesPage /> } />

            <Route path={ RoutesService.Profile } element={ <PrfilePage /> } />
          </Route>
        </Route>

        <Route path="*" element={ <NotFoundPage /> } />
      </Routes>
    </Router>
  );
}

export default App;
