import { describe, it } from "node:test";
import { expect } from "expect";
import { splitRawLog } from "../src/logParser.js";
import { getTestDataFile } from "./util/index.js";
import fs from "fs";
import { parse } from "csv/sync";

describe("logParser", () => {
  const outputDir = fs.mkdtempSync("/tmp/test-logParser-");
  const parseCsv = (fileName: string) => {
    return parse(fs.readFileSync(fileName), {
      delimiter: "\t",
      columns: true,
    }) as unknown;
  };
  it("splits a basic hostile combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("in/hirogen-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
    csvFiles.forEach((actual, i) => {
      const expectedFile = getTestDataFile(`out/hirogen-${i}.csv`);
      expect(parseCsv(actual.filePath)).toEqual(parseCsv(expectedFile));
    });
  });
  it("splits a formada combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("in/formada-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(5);
  });
  it("splits a defeat PVP combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("in/defeat-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
  it("splits a partial victory PVP combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("in/partial-victory-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
  // TODO add tests with:
  // - regular armada
  // - solo armada
  // - invading entity
  // - station
  // - ship on a mining/capture node?
});
