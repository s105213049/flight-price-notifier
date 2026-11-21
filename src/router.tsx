import { createBrowserRouter, type RouteObject } from "react-router";

import { RootLayout, RootError, NotFound } from "@/components/RootLayout";
import { authenticatedLoader, AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import AppDashboard from "@/pages/AppDashboard";

// Public pages sit directly under the root; signed-in pages live under the
// "authenticated" layout, whose loader redirects to /auth when there is no user.
export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    element: <RootLayout />,
    errorElement: <RootError />,
    children: [
      { id: "index", index: true, element: <Index /> },
      { id: "auth", path: "auth", element: <SignIn /> },
      { id: "signup", path: "signup", element: <SignUp /> },
      {
        id: "authenticated",
        loader: authenticatedLoader,
        element: <AuthenticatedLayout />,
        children: [{ id: "app", path: "app", element: <AppDashboard /> }],
      },
      { id: "not-found", path: "*", element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
