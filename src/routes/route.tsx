import { createBrowserRouter } from "react-router-dom";
import { routeConfig } from "./routeConfig";
import PageNotFound from "../GlobalComponents/PageNotFound";
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requiredRole?: string;
}


export function ProtectedRoute({ component: Component, requiredRole }: ProtectedRouteProps) {
  const userRole = localStorage.getItem('userRole'); // or from context

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/loginPage" replace />;
  }

  return <Component />;
}
const router = createBrowserRouter(
  routeConfig.map((group) => {
    const Layout = group.layout;
    const Component = group.component || Layout;

    // Handle standalone routes (use `component` when provided)
    if (group.path && !group.children) {
      return {
        path: group.path,
        Component: Component,
        errorElement: <PageNotFound />,
      };
    }

    // Handle layout routes with children
    return {
      ...(group.path ? { path: group.path } : {}),
      Component: Layout,
      errorElement: <PageNotFound />,
      children: group.children?.map((route) => ({
        path: route.path,
        Component: route.component,
        loader: route.loader,
      })) ?? []
    };
  })
);

export default router;