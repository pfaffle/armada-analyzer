import request from "supertest";
import { app } from "../app.ts";

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
