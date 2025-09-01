import { lazy, type JSX } from "react";

const Home = lazy(() => import("../pages/home/Home"));
const Analytics = lazy(() => import("../pages/analytics/Analytics"));
const ContentDetail = lazy(
  () => import("../pages/contentDetails/ContentDetails")
);

export interface AppRoute {
  path: string;
  element: JSX.Element;
}

export const routes: AppRoute[] = [
  { path: "/", element: <Home /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/content/:id", element: <ContentDetail /> },
];
