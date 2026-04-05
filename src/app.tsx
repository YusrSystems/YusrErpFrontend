import {
  ProtectedRoute,
  Skeleton,
  ThemeProvider,
  Toaster,
  TooltipProvider,
} from "@yusr_systems/ui";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLayout from "./appLayout";
import useAppInitialization from "./core/hooks/useAppInitialization";
import { useAppSelector } from "./core/state/store";
import DashboardPage from "./features/dashboard/dashboardPage";
import LandingPage from "./features/landing/landingPage";
import LoginPage from "./features/login/loginPage";
import NotFoundPage from "./features/notFound/notFoundPage";
import SettingPage from "./features/setting/settingPage";
import TaxesPage from "./features/taxes/presentation/taxesPage";
import UsersPage from "./features/users/presentation/usersPage";
import BranchesPage from "./features/branches/presentation/branchesPage";
import RolesPage from "./features/roles/presentation/rolesPage";
import StoresPage from "./features/stores/presentation/storePage";
import UnitsPage from "./features/units/unitsPage";
import AccountsPage from "./features/accounts/accountsPage";

function App() {
  const { isLoading } = useAppInitialization();

  if (isLoading) {
    return <Apploading />;
  }

  return <AppBody />;
}

function AppBody() {
  return (
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <AppRoutes />
        <Toaster richColors closeButton position="top-center" dir="rtl" />
      </ThemeProvider>
    </TooltipProvider>
  );
}

function Apploading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

function AppRoutes() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/taxes" element={<TaxesPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
