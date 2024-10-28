import request from "supertest";
import { initApp } from "../app.ts";
const app = initApp();

describe("basic app", () => {
  it("responds to /healthz", async () => {
    await request(app).get("/healthz").expect(204);
  });
  it("serves the placeholder static site", async () => {
    const response = await request(app)
      .get("/")
      .expect("content-type", /text\/html/)
      .expect(200);
    expect(response.text).toMatch(/Armada Analyzer/);
  });
});
