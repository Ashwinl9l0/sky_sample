import searchReducer, { setQuery } from "../redux/slices/searchSlice";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import AppHeader from "./Header";
import { configureStore } from "@reduxjs/toolkit";
import * as Router from "react-router";

const renderWithProviders = (
  ui: React.ReactNode,
  {
    route = "/",
    store = configureStore({ reducer: { search: searchReducer } }),
  } = {}
) => {
  window.history.pushState({}, "Test page", route);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("AppHeader", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders logo and avatar", () => {
    renderWithProviders(<AppHeader />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByLabelText("logo")).toBeInTheDocument();
  });

  it("shows search bar only on home route", () => {
    // Home route
    renderWithProviders(<AppHeader />, { route: "/" });
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
    cleanup();
    // Other route
    renderWithProviders(<AppHeader />, { route: "/analytics" });
    expect(screen.queryByPlaceholderText("Search…")).not.toBeInTheDocument();
  });

  it("dispatches setQuery when typing in search", () => {
    const store = configureStore({ reducer: { search: searchReducer } });
    const spy = vi.spyOn(store, "dispatch");

    renderWithProviders(<AppHeader />, { store, route: "/" });

    const input = screen.getByPlaceholderText("Search…");
    fireEvent.change(input, { target: { value: "React" } });

    expect(spy).toHaveBeenCalledWith(setQuery("React"));
  });

  it("navigates home when clicking logo", () => {
    const mockNavigate = vi.fn();
    vi.spyOn(Router, "useNavigate").mockReturnValue(mockNavigate);

    renderWithProviders(<AppHeader />, { route: "/analytics" });

    const logo = screen.getByAltText("logo");
    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("highlights analytics link when on /analytics", () => {
    renderWithProviders(<AppHeader />, { route: "/analytics" });
    const analyticsLink = screen.getByRole("link", { name: /analytics/i });
    expect(analyticsLink.className).toContain("active");
  });
});
