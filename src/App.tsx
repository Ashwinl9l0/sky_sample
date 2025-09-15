import "./assets/style/global.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AppHeader from "./layout/Header";
import { routes } from "./routes/mainRoutes";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ErrorBoundary from "./components/ErrorBoundary";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <div>
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
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
