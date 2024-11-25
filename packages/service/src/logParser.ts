import { parse } from "csv/sync";
import fs from "fs/promises";
import path from "path";
import {
  SummaryLogParser,
  ParsedSummaryLogSegment,
} from "./models/SummaryLog.js";
import { FleetsLogParser, ParsedFleetsLogSegment } from "./models/FleetsLog.js";
import debug from "debug";
import {
  ParsedRewardsLogSegment,
  RewardsLogParser,
} from "./models/RewardsLog.js";
import { ParsedRoundsLogSegment, RoundsLogParser } from "./models/RoundsLog.js";
const log = debug("app:logParser");

export interface ParsedUnknownLogSegment {
  type: "unknown";
  records: unknown[];
}

export type CombatLogSegment =
  | ParsedSummaryLogSegment
  | ParsedFleetsLogSegment
  | ParsedRewardsLogSegment
  | ParsedRoundsLogSegment
  | ParsedUnknownLogSegment;

export async function splitRawLog(logPath: string, outputDir: string) {
  await fs.mkdir(outputDir, { recursive: true });
  const outFileBaseName = path.basename(logPath, ".csv");
  const inputLog = await fs.open(logPath);
  let i = 0;
  let writingFile = true;
  let outFile = path.join(outputDir, `${outFileBaseName}-${i}.csv`);
  let outputLog = await fs.open(outFile, "w+");
  let outputFiles: string[] = [outFile];
  for await (const line of inputLog.readLines()) {
    if (line === "") {
      // end of a raw log segment, keep skipping any additional blank lines
      writingFile = false;
    } else {
      if (!writingFile) {
        // close csv, start writing new csv
        await outputLog.close();
        i = i + 1;
        outFile = path.join(outputDir, `${outFileBaseName}-${i}.csv`);
        outputLog = await fs.open(outFile, "w+");
        outputFiles = outputFiles.concat([outFile]);
        writingFile = true;
      }
      await outputLog.writeFile(`${line}\n`);
    }
  }
  await inputLog.close();
  await outputLog.close();
  return outputFiles;
}

export async function parseLog(filePath: string): Promise<CombatLogSegment> {
  const inputLog = await fs.open(filePath);
  const parsedLog: unknown = parse(
    await inputLog.readFile({ encoding: "utf8" }),
    {
      delimiter: "\t",
      encoding: "utf8",
      columns: true,
      // See: Issue #21
      relax_column_count_less: true,
    },
  );
  await inputLog.close();
  if (!Array.isArray(parsedLog)) {
    log({ log: parsedLog });
    throw new Error("unexpected CSV format");
  }
  let typedLogs: CombatLogSegment | undefined;
  for (const parser of [
    SummaryLogParser,
    FleetsLogParser,
    RewardsLogParser,
    RoundsLogParser,
  ]) {
    typedLogs = parser.parse(parsedLog);
    if (typedLogs) {
      break;
    }
  }
  if (typedLogs) {
    return typedLogs;
  } else {
    return {
      type: "unknown",
      records: parsedLog,
    };
  }
}
