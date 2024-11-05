import { expect, test } from "vitest";
import { App } from "../App";
import { FileUploader } from "../FileUploader";
import { render, screen } from "@testing-library/react";

test("test that App renders", () => {
  render(<App />);
  screen.debug();
  expect(true).toBe(true);
});

test("test that FileUploader renders", () => {
  render(<FileUploader />);
  screen.debug();
  expect(true).toBe(true);
});
