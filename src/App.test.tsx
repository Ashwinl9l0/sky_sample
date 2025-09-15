// App.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

// We import routes to know what to expect

describe("App", () => {
  it("renders AppHeader", () => {
    render(<App />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  it("renders fallback loader while lazy route loads", () => {
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  it("redirects unknown route to home", async () => {
    render(<App />);

    expect(await screen.findByPlaceholderText("Search…")).toBeInTheDocument();
  });
});
