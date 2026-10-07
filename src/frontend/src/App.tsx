import { RequireAuth } from "@/components/auth/RequireAuth";
import { Toaster } from "@/components/ui/sonner";
import { ClassesPage } from "@/pages/ClassesPage";
import { DashboardLayout } from "@/pages/DashboardLayout";
import { LoginPage } from "@/pages/LoginPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { StudentsPage } from "@/pages/StudentsPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <RequireAuth>
      <DashboardLayout />
    </RequireAuth>
  ),
});

const overviewRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: OverviewPage,
});

const studentsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/students",
  component: StudentsPage,
});

const classesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/classes",
  component: ClassesPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <LoginPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute.addChildren([overviewRoute, studentsRoute, classesRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
}
