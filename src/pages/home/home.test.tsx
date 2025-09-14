import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router";

import * as ApiService from "../../services/ApiService";
import Home from "./Home";

const mockMovies = [
  {
    name: "Movie 1",
    genre: ["Action", "Drama"],
    totalViews: { total: 1000 },
    videoImage: "movie1.jpg",
    provider: "Sky Cinema",
    duration: 120,
    description: "Movie 1 description",
  },
  {
    name: "Movie 2",
    genre: ["Comedy"],
    totalViews: { total: 500 },
    videoImage: "movie2.jpg",
    provider: "Sky Cinema",
    duration: 90,
    description: "Movie 2 description",
  },
];

vi.mock("../../services/ApiService", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockStore = configureStore();
const initialState = {
  search: { query: "" },
};

function renderHome(storeState = initialState) {
  const store = mockStore(storeState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );
}

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner initially", async () => {
    (ApiService.default.get as any).mockResolvedValueOnce({ data: mockMovies });
    renderHome();
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("renders most watched movie and genres after loading", async () => {
    (ApiService.default.get as any).mockResolvedValueOnce({ data: mockMovies });
    renderHome();
    expect(await screen.findByText(/#Most Watched/i)).toBeInTheDocument();
    const movie1Elements = await screen.findAllByText(/Movie 1/i);
    expect(movie1Elements.length).toBeGreaterThan(0);

    const actionElements = await screen.findAllByText(/Action/i);
    expect(actionElements.length).toBeGreaterThan(0);

    const dramaElements = await screen.findAllByText(/Drama/i);
    expect(dramaElements.length).toBeGreaterThan(0);
  });

  it("shows 'No content found' if API returns empty", async () => {
    (ApiService.default.get as any).mockResolvedValueOnce({ data: [] });
    renderHome();
    expect(await screen.findByText(/No content found/i)).toBeInTheDocument();
  });

  it("renders search results when query is present", async () => {
    (ApiService.default.get as any).mockResolvedValueOnce({ data: mockMovies });
    const storeState = {
      search: { query: "Movie 2" },
    };
    renderHome(storeState);
    expect(await screen.findByText(/Search Result of/i)).toBeInTheDocument();
    const movie2Elements = await screen.findAllByText(/Movie 2/i);
    expect(movie2Elements.length).toBeGreaterThan(0);
  });

  it("handles API error gracefully", async () => {
    (ApiService.default.get as any).mockRejectedValueOnce(
      new Error("API Error")
    );
    renderHome();
    expect(await screen.findByText(/No content found/i)).toBeInTheDocument();
  });
});
