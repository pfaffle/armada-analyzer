import request from "supertest";
import { initApp } from "../../app.ts";
import { router as armadaRouter } from "../../routes/armada.ts";
import { readTestDataFile } from "../__util__/index.ts";

const app = initApp();
app.use("/armada", armadaRouter);
const combatLog = readTestDataFile(
  "2024-10-20 17-40-24-hirogen-combat-log.csv",
);

describe("/armada/upload route", () => {
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