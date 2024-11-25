import { describe, it } from "node:test";
import { expect } from "expect";
import { splitRawLog } from "../src/logParser.js";
import { getTestDataFile } from "./util/index.js";
import fs from "fs";

describe("logParser", () => {
  const outputDir = fs.mkdtempSync("/tmp/test-logParser-");
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
