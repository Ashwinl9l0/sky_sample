import Home from "../pages/home/Home";
import Analytics from "../pages/analytics/Analytics";
import ContentDetail from "../pages/contentDetails/ContentDetails";
import type { JSX } from "react";

export interface AppRoute {
  path: string;
  element: JSX.Element;
}

export const routes: AppRoute[] = [
  { path: "/", element: <Home /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/content/:id", element: <ContentDetail /> },
];
