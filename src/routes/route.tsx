import { createBrowserRouter } from "react-router-dom";
import { routeConfig } from "./routeConfig";
import PageNotFound from "../GlobalComponents/PageNotFound";

const router = createBrowserRouter(
  routeConfig.map((group) => {
    const Layout = group.layout;

    return {
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