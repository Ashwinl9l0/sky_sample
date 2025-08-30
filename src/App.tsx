import "./assets/style/global.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AppHeader from "./layout/Header";
import { routes } from "./routes/mainRoutes";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AppHeader />
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
