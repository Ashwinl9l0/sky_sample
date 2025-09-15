import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router";

import * as ApiService from "../../services/ApiService";
import Analytics from "./Analytics";

const mockStore = configureStore();
const initialState = {
  search: { query: "" },
};

const mockData = [
  { timestamp: "2025-09-15T10:00:00Z", value: 100 },
  { timestamp: "2025-09-15T11:00:00Z", value: 200 },
  { timestamp: "2025-09-15T12:00:00Z", value: 300 },
];

vi.mock("../../services/ApiService", () => ({
  default: {
    get: vi.fn(),
  },
}));

function renderAnalytics(storeState = initialState) {
  const store = mockStore(storeState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    </Provider>
  );
}

describe("Analytics Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner initially", () => {
    (ApiService.default.get as any).mockResolvedValueOnce({ data: [] });
    renderAnalytics();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders metrics after API data is loaded", async () => {
    (ApiService.default.get as any).mockResolvedValueOnce({ data: mockData });

    renderAnalytics();

    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );

    expect(screen.getByText(/Peak Value/i)).toBeInTheDocument();
    expect(screen.getByText(/Average/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Points/i)).toBeInTheDocument();
    expect(screen.getByText(/Range/i)).toBeInTheDocument();

    expect(screen.getByText("300")).toBeInTheDocument();
    const mulValue = await screen.findAllByText(/200/i);
    expect(mulValue.length).toBeGreaterThan(0);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows fallback UI when API fails", async () => {
    (ApiService.default.get as any).mockRejectedValueOnce(
      new Error("API Error")
    );

    renderAnalytics();

    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );

    expect(
      screen.getByRole("heading", { name: /Platform Analytics/i })
    ).toBeInTheDocument();
  });
});
