import { describe, expect, it } from "vitest";
import { App } from "../App";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "@/__tests__/__utils__/utils";

describe("App", () => {
  it("renders correct content", () => {
    renderWithTheme(<App />);
    expect(screen.getByRole("heading", { name: "Armada Analyzer" }));
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByRole("paragraph", { name: "Intro" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "pfaffle" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Source" })).toBeInTheDocument();
  });
});
