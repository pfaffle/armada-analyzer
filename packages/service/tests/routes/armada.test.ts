import { describe, it } from "node:test";
import { expect } from "expect";
import request from "supertest";
import { initApp } from "../../src/app.js";
import { createRouter as createArmadaRouter } from "../../src/routes/armada.js";
import { readTestDataFile } from "../util/index.js";
import fs from "fs";

describe("/armada/upload route", () => {
  const uploadsPath = fs.mkdtempSync("/tmp/test-uploads-");
  const splitLogsPath = fs.mkdtempSync("/tmp/test-splitlogs-");
  const app = initApp();
  app.use("/armada", createArmadaRouter({ uploadsPath, splitLogsPath }));
  const combatLog = readTestDataFile("in/hirogen-log.csv");

  it("returns success", async () => {
    const response = await request(app)
      .post("/armada/upload")
      .attach("file", combatLog, "combat_log.csv")
      .expect(200);
    expect(response.body).toMatchObject({ status: "success" });
  });
  it("returns 400 if no file", async () => {
    await request(app).post("/armada/upload").expect(400);
  });
  it("returns 400 if file is attached to the wrong form field", async () => {
    await request(app)
      .post("/armada/upload")
      .attach("wrong_field", combatLog, "combat_log.csv")
      .expect(400);
  });
  it("returns 400 if multiple files", async () => {
    await request(app)
      .post("/armada/upload")
      .attach("file", combatLog, "combat_log.csv")
      .attach("file2", combatLog, "combat_log.csv")
      .expect(400);
  });
  it("returns 400 if extraneous form fields", async () => {
    await request(app)
      .post("/armada/upload")
      .field("garbage", "garbage")
      .attach("file", combatLog, "combat_log.csv")
      .expect(400);
  });
  it("returns 400 if file too large", async () => {
    const bigFile = Buffer.alloc(5 * 1024 * 1024 + 10);
    await request(app)
      .post("/armada/upload")
      .attach("file", bigFile, "combat_log.csv")
      .expect(400);
  });
});
