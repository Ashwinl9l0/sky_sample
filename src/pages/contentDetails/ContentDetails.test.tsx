import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

import * as ApiService from "../../services/ApiService";
import ContentDetail from "./ContentDetails";

vi.mock("../../services/ApiService", () => ({
  default: vi.fn(),
}));

const mockMovies = [
  {
    name: "Movie 1",
    description: "Movie 1 description",
    duration: 7200,
    genre: ["Action", "Drama"],
    provider: "Sky Cinema",
    videoImage: "movie1.jpg",
    totalViews: {
      total: 1000,
      "sky-go": 400,
      "now-tv": 300,
      peacock: 300,
    },
    prevTotalViews: {
      "sky-go": 300,
      "now-tv": 200,
      peacock: 200,
    },
  },
  {
    name: "Movie 2",
    description: "Movie 2 description",
    duration: 5400,
    genre: ["Action", "Comedy"],
    provider: "Sky Cinema",
    videoImage: "movie2.jpg",
    totalViews: { total: 500, "sky-go": 200, "now-tv": 150, peacock: 150 },
    prevTotalViews: { "sky-go": 100, "now-tv": 50, peacock: 50 },
  },
  {
    name: "Movie 3",
    description: "Movie 3 description",
    duration: 6000,
    genre: ["Drama"],
    provider: "Sky Cinema",
    videoImage: "movie3.jpg",
    totalViews: { total: 700, "sky-go": 250, "now-tv": 200, peacock: 250 },
    prevTotalViews: { "sky-go": 120, "now-tv": 80, peacock: 100 },
  },
  {
    name: "Movie 4",
    description: "Movie 4 description",
    duration: 8000,
    genre: ["Thriller"],
    provider: "Sky Cinema",
    videoImage: "movie4.jpg",
    totalViews: { total: 900, "sky-go": 300, "now-tv": 300, peacock: 300 },
    prevTotalViews: { "sky-go": 200, "now-tv": 200, peacock: 200 },
  },
  {
    name: "Movie 5",
    description: "Movie 5 description",
    duration: 4000,
    genre: ["Comedy"],
    provider: "Sky Cinema",
    videoImage: "movie5.jpg",
    totalViews: { total: 300, "sky-go": 100, "now-tv": 100, peacock: 100 },
    prevTotalViews: { "sky-go": 50, "now-tv": 30, peacock: 20 },
  },
  {
    name: "Movie 6",
    description: "Movie 6 description",
    duration: 5000,
    genre: ["Drama", "Action"],
    provider: "Sky Cinea",
    videoImage: "movie6.jpg",
    totalViews: { total: 400, "sky-go": 150, "now-tv": 120, peacock: 130 },
    prevTotalViews: { "sky-go": 80, "now-tv": 60, peacock: 70 },
  },
  {
    name: "Movie 7",
    description: "Movie 6 description",
    duration: 5000,
    genre: ["Drama", "Action"],
    provider: "Sky Cinea",
    videoImage: "movie6.jpg",
    totalViews: { total: 400, "sky-go": 150, "now-tv": 120, peacock: 130 },
    prevTotalViews: { "sky-go": 80, "now-tv": 60, peacock: 70 },
  },
  {
    name: "Movie 8",
    description: "Movie 6 description",
    duration: 5000,
    genre: ["Drama", "Action"],
    provider: "Sky Cinea",
    videoImage: "movie6.jpg",
    totalViews: { total: 400, "sky-go": 150, "now-tv": 120, peacock: 130 },
    prevTotalViews: { "sky-go": 80, "now-tv": 60, peacock: 70 },
  },
  {
    name: "Movie 9",
    description: "Movie 6 description",
    duration: 5000,
    genre: ["Drama", "Action"],
    provider: "Sky Cinea",
    videoImage: "movie6.jpg",
    totalViews: { total: 400, "sky-go": 150, "now-tv": 120, peacock: 130 },
    prevTotalViews: { "sky-go": 80, "now-tv": 60, peacock: 70 },
  },
  {
    name: "Movie 10",
    description: "Movie 6 description",
    duration: 5000,
    genre: ["Drama", "Action"],
    provider: "Sky Cinea",
    videoImage: "movie6.jpg",
    totalViews: { total: 400, "sky-go": 150, "now-tv": 120, peacock: 130 },
    prevTotalViews: { "sky-go": 80, "now-tv": 60, peacock: 70 },
  },
];

function renderContentDetail(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/${id}`]}>
      <Routes>
        <Route path="/:id" element={<ContentDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ContentDetail Page with multiple movies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the selected movie even when multiple exist", async () => {
    (ApiService.default as any).mockResolvedValueOnce({ data: mockMovies });

    renderContentDetail("Movie 1");

    expect(await screen.findByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Movie 1 description")).toBeInTheDocument();
    expect(screen.getByText(/120 mins/i)).toBeInTheDocument();
  });

  it("renders similar movies based on genre overlap", async () => {
    (ApiService.default as any).mockResolvedValueOnce({ data: mockMovies });

    renderContentDetail("Movie 1");

    const similarSection = await screen.findByTestId("similar-movies");

    expect(similarSection).toHaveTextContent("Movie 2");
    expect(similarSection).toHaveTextContent("Movie 3");
    expect(similarSection).toHaveTextContent("Movie 6");
  });

  it("shows Content Not Found for unknown movie id", async () => {
    (ApiService.default as any).mockResolvedValueOnce({ data: mockMovies });

    renderContentDetail("UnknownMovie");

    expect(await screen.findByText(/Content Not Found/i)).toBeInTheDocument();
  });

  it("renders carousel rows with items", async () => {
    (ApiService.default as any).mockResolvedValueOnce({ data: mockMovies });

    renderContentDetail("Movie 1");

    expect(await screen.findByText(/Similar Movies/i)).toBeInTheDocument();
    expect(await screen.findByText(/Movie 2/i)).toBeInTheDocument();
  });
  it("shows next button only after mouse enter", async () => {
    (ApiService.default as any).mockResolvedValueOnce({ data: mockMovies });

    renderContentDetail("Movie 1");
    const carouselDiv = await screen.findByLabelText("genere_carousel");

    expect(screen.queryByLabelText("chevronright")).not.toBeInTheDocument();

    fireEvent.mouseEnter(carouselDiv);

    await waitFor(
      async () => {
        expect(
          await screen.findByLabelText("chevronright")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    fireEvent.mouseLeave(carouselDiv);
    await waitFor(() => {
      expect(screen.queryByLabelText("chevronright")).not.toBeInTheDocument();
    });
  });
  it("click next button only after mouse enter", async () => {
    (ApiService.default as any).mockResolvedValueOnce({ data: mockMovies });

    renderContentDetail("Movie 1");
    const carouselDiv = await screen.findByLabelText("genere_carousel");

    expect(screen.queryByLabelText("chevronright")).not.toBeInTheDocument();

    fireEvent.mouseEnter(carouselDiv);

    await waitFor(
      async () => {
        expect(
          await screen.findByLabelText("chevronright")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
    const nextButton = await screen.findByLabelText("chevronright");
    fireEvent.click(nextButton);
    fireEvent.mouseEnter(carouselDiv);

    await waitFor(() => {
      expect(screen.queryByLabelText("chevronright")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("chevronleft")).toBeInTheDocument();
    });
    const prevButton = await screen.findByLabelText("chevronleft");
    fireEvent.click(prevButton);
    await waitFor(() => {
      expect(screen.queryByLabelText("chevronright")).toBeInTheDocument();
      expect(screen.queryByLabelText("chevronleft")).not.toBeInTheDocument();
    });
  });
  it("handles API error gracefully", async () => {
    (ApiService.default as any).mockRejectedValueOnce(new Error("API Error"));
    renderContentDetail("Movie 1");

    expect(await screen.findByText(/Content Not Found/i)).toBeInTheDocument();
  });
});
