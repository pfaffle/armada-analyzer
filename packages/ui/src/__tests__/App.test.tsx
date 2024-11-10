import { describe, expect, it } from "vitest";
import { App } from "../App";
import { render, screen } from "@testing-library/react";

describe("App", () => {
  it("renders correct content", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Armada Analyzer" }));
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByRole("paragraph", { name: "Intro" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "pfaffle" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Source" })).toBeInTheDocument();
  });
});
