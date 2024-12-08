import { describe, it } from "node:test";
import { expect } from "expect";
import {
  createLogParser,
  detectSchema,
  parseLog,
  splitRawLog,
} from "../src/logParser.js";
import { getTestDataFile } from "./util/index.js";
import fs from "fs";
import { parse } from "csv/sync";
import { fail } from "assert";

describe("splitRawLog", () => {
  const outputDir = fs.mkdtempSync("/tmp/test-splitRawLog-");
  const parseCsv = (fileName: string) => {
    return parse(fs.readFileSync(fileName), {
      delimiter: "\t",
      columns: true,
    }) as unknown;
  };
  it("splits a basic hostile combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("beforeSplit/hirogen-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
    // extra validation for this one test to make sure the output
    // structure is correct
    csvFiles.forEach((actual, i) => {
      const expected = getTestDataFile(`afterSplit/hirogen-${i}.csv`);
      expect(parseCsv(actual)).toEqual(parseCsv(expected));
    });
  });
  it("splits a formada combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("beforeSplit/formada-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(5);
  });
  it("splits a defeat PVP combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("beforeSplit/defeat-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
  it("splits a partial victory PVP combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("beforeSplit/partial-victory-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
  it("splits an eclipse armada combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("beforeSplit/eclipse-armada-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
  it("splits a dominion solo armada combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("beforeSplit/dominion-solo-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
  it("splits a mining combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("beforeSplit/data-mining-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
  it("splits a station combat log", async () => {
    const csvFiles = await splitRawLog(
      getTestDataFile("beforeSplit/station-log.csv"),
      outputDir,
    );
    expect(csvFiles).toHaveLength(4);
  });
});

describe("parseLog", () => {
  it("parses combat summary", async () => {
    const actual = await parseLog(
      getTestDataFile("parsing/hostile-summary.csv"),
    );
    const expected = JSON.parse(
      fs.readFileSync(getTestDataFile("parsing/hostile-parsed-summary.json"), {
        encoding: "utf8",
      }),
    ) as unknown;
    expect(actual.records).toEqual(expected);
  });
  it("parses combat fleets", async () => {
    const actual = await parseLog(
      getTestDataFile("parsing/hostile-fleets.csv"),
    );
    const expected = JSON.parse(
      fs.readFileSync(getTestDataFile("parsing/hostile-parsed-fleets.json"), {
        encoding: "utf8",
      }),
    ) as unknown;
    expect(actual.records).toEqual(expected);
  });
  it("parses combat rewards", async () => {
    const actual = await parseLog(
      getTestDataFile("parsing/hostile-rewards.csv"),
    );
    const expected = JSON.parse(
      fs.readFileSync(getTestDataFile("parsing/hostile-parsed-rewards.json"), {
        encoding: "utf8",
      }),
    ) as unknown;
    expect(actual.records).toEqual(expected);
  });
  it("parses combat rounds", async () => {
    const actual = await parseLog(
      getTestDataFile("parsing/hostile-rounds.csv"),
    );
    const expected = JSON.parse(
      fs.readFileSync(getTestDataFile("parsing/hostile-parsed-rounds.json"), {
        encoding: "utf8",
      }),
    ) as unknown;
    expect(actual.records).toEqual(expected);
  });
});

describe("detectSchema", () => {
  it("detects fleets schema", async () => {
    expect(
      await detectSchema(getTestDataFile("parsing/hostile-fleets.csv")),
    ).toEqual("fleets");
  });
  it("detects rewards schema", async () => {
    expect(
      await detectSchema(getTestDataFile("parsing/hostile-rewards.csv")),
    ).toEqual("rewards");
  });
  it("detects rounds schema", async () => {
    expect(
      await detectSchema(getTestDataFile("parsing/hostile-rounds.csv")),
    ).toEqual("rounds");
  });
  it("detects summary schema", async () => {
    expect(
      await detectSchema(getTestDataFile("parsing/hostile-summary.csv")),
    ).toEqual("summary");
  });
  it("successfully detects the schema if data is empty", async () => {
    expect(
      await detectSchema(getTestDataFile("parsing/reward-log-noloot.csv")),
    ).toEqual("rewards");
  });
  it("returns undefined if unrecognized schema", async () => {
    expect(
      await detectSchema(getTestDataFile("parsing/random-csv.csv")),
    ).toBeUndefined();
  });
});

describe("logParser", () => {
  const splitLogsPath = fs.mkdtempSync("/tmp/test-logParser-");
  const logParser = createLogParser({ splitLogsPath });

  it("parses a log", async () => {
    const logs = await logParser.parse(
      getTestDataFile("beforeSplit/data-mining-log.csv"),
    );
    expect(logs.length).toEqual(4);
    expect(logs.map((l) => l.type).sort()).toEqual([
      "fleets",
      "rewards",
      "rounds",
      "summary",
    ]);
  });
  it("throws an error if given an invalid csv format", async () => {
    try {
      await logParser.parse(getTestDataFile("parsing/random-csv.csv"));
      fail("method did not throw");
    } catch (e) {
      expect((e as Error).message).toEqual("unexpected CSV format");
    }
  });
});
