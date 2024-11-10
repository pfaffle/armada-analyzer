import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/vitest";
import { mockServer } from "../mocks/node";

expect.extend(matchers);

beforeAll(() => {
  mockServer.listen();
});
afterEach(() => {
  cleanup();
  mockServer.resetHandlers(...[]);
});
afterAll(() => {
  mockServer.close();
});
