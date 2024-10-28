import request from "supertest";
import { initApp } from "../app.ts";
const app = initApp();

describe("basic app", () => {
  it("responds to /healthz", async () => {
    await request(app).get("/healthz").expect(204);
  });
});
