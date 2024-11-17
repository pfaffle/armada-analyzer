import { splitRawLog } from "../parseLog.ts";
import { getTestDataFile } from "./__util__/index.ts";
import fs from "fs";

describe("parseLog", () => {
  const outputDir = fs.mkdtempSync("/tmp/parseLogTest-");
  it("splits a basic combat log into individual components", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("2024-10-20 17-40-24-hirogen-combat-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
  it("splits a formada combat log into individual components", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("2024-10-21 00-24-58-formada-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(5);
  });
  // TODO add tests with:
  // - regular armada
  // - solo armada
  // - pvp
  // - invading entity
  // - station
  // - ship on a mining/capture node?
});
