import { describe, it, Mock, mock, beforeEach } from "node:test";
import { expect } from "expect";
import request from "supertest";
import { initApp } from "../../src/app.js";
import { createRouter as createArmadaRouter } from "../../src/routes/armada.js";
import { getTestDataFile } from "../util/index.js";
import fs from "fs";
import { CombatLogSegment } from "../../src/logParser.js";

describe("/armada/upload route", () => {
  const uploadsPath = fs.mkdtempSync("/tmp/test-uploads-");
  const app = initApp();
  const mockParse: Mock<(logPath: string) => Promise<CombatLogSegment[]>> =
    mock.fn();
  const mockLogParser = {
    parse: mockParse,
  };
  app.use(
    "/armada",
    createArmadaRouter({ uploadsPath, logParser: mockLogParser }),
  );
  const combatLog = fs.readFileSync(
    getTestDataFile("beforeSplit/hirogen-log.csv"),
  );

  beforeEach(() => {
    mockParse.mock.resetCalls();
  });

  it("returns success", async () => {
    const response = await request(app)
      .post("/armada/upload")
      .attach("file", combatLog, "combat_log.csv")
      .expect(200);
    expect(response.body).toMatchObject({ status: "success" });
    expect(mockLogParser.parse.mock.callCount()).toEqual(1);
  });
  it("returns 400 if no file", async () => {
    await request(app).post("/armada/upload").expect(400);
    expect(mockLogParser.parse.mock.callCount()).toEqual(0);
  });
  it("returns 400 if file is attached to the wrong form field", async () => {
    await request(app)
      .post("/armada/upload")
      .attach("wrong_field", combatLog, "combat_log.csv")
      .expect(400);
    expect(mockLogParser.parse.mock.callCount()).toEqual(0);
  });
  it("returns 400 if multiple files", async () => {
    await request(app)
      .post("/armada/upload")
      .attach("file", combatLog, "combat_log.csv")
      .attach("file2", combatLog, "combat_log.csv")
      .expect(400);
    expect(mockLogParser.parse.mock.callCount()).toEqual(0);
  });
  it("returns 400 if extraneous form fields", async () => {
    await request(app)
      .post("/armada/upload")
      .field("garbage", "garbage")
      .attach("file", combatLog, "combat_log.csv")
      .expect(400);
    expect(mockLogParser.parse.mock.callCount()).toEqual(0);
  });
  it("returns 413 if file too large", async () => {
    const bigFile = Buffer.alloc(5 * 1024 * 1024 + 10);
    await request(app)
      .post("/armada/upload")
      .attach("file", bigFile, "combat_log.csv")
      .expect(413);
    expect(mockLogParser.parse.mock.callCount()).toEqual(0);
  });
  it("returns 422 if the CSV fails to parse", async () => {
    mockLogParser.parse = mock.fn(() => {
      throw new Error("kaboom");
    });
    await request(app)
      .post("/armada/upload")
      .attach("file", Buffer.from("garbage content"), "combat_log.csv")
      .expect(422);
    expect(mockLogParser.parse.mock.callCount()).toEqual(1);
  });
});
