import "./assets/style/global.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AppHeader from "./layout/Header";
import { routes } from "./routes/mainRoutes";
import { Suspense } from "react";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AppHeader />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
