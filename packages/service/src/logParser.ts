import { parse } from "csv/sync";
import fs from "fs/promises";
import path from "path";
import {
  summarySchemaType,
  SummaryLogParser,
  SummaryLogSegment,
} from "./models/SummaryLog.js";
import {
  fleetsSchemaType,
  FleetsLogParser,
  FleetsLogSegment,
} from "./models/FleetsLog.js";
import debug from "debug";
import {
  rewardsSchemaType,
  RewardsLogParser,
  RewardsLogSegment,
} from "./models/RewardsLog.js";
import {
  roundsSchemaType,
  RoundsLogParser,
  RoundsLogSegment,
} from "./models/RoundsLog.js";
const log = debug("app:logParser");

type schemaType =
  | fleetsSchemaType
  | rewardsSchemaType
  | roundsSchemaType
  | summarySchemaType;

export type CombatLogSegment =
  | FleetsLogSegment
  | RewardsLogSegment
  | RoundsLogSegment
  | SummaryLogSegment;

export async function splitRawLog(logPath: string, outputDir: string) {
  await fs.mkdir(outputDir, { recursive: true });
  const outFileBaseName = path.basename(logPath, ".csv");
  let i = 0;
  let writingFile = true;
  let outFile = path.join(outputDir, `${outFileBaseName}-${i}.csv`);
  let outputFiles: string[] = [outFile];
  const inputLog = await fs.open(logPath);
  let outputLog = await fs.open(outFile, "w+");
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

export async function detectSchema(
  filePath: string,
): Promise<schemaType | undefined> {
  const inputLog = await fs.open(filePath);
  for await (const line of inputLog.readLines()) {
    await inputLog.close();
    const columns = line.split("\t");
    const testRow = columns.reduce(
      (o, column) => {
        o[column] = "";
        return o;
      },
      {} as { [key: string]: string },
    );
    for (const parser of [
      FleetsLogParser,
      RewardsLogParser,
      RoundsLogParser,
      SummaryLogParser,
    ]) {
      if (parser.matchesSchema(testRow)) {
        return parser.type;
      }
    }
    return undefined;
  }
}

function getParser(type: schemaType | undefined) {
  switch (type) {
    case "fleets":
      return FleetsLogParser;
    case "rewards":
      return RewardsLogParser;
    case "rounds":
      return RoundsLogParser;
    case "summary":
      return SummaryLogParser;
    default:
      return undefined;
  }
}

export async function parseLog(filePath: string): Promise<CombatLogSegment> {
  const schema = await detectSchema(filePath);
  const parser = getParser(schema);
  const inputLog = await fs.open(filePath);
  const parsedLog: unknown = parse(
    await inputLog.readFile({ encoding: "utf8" }),
    {
      delimiter: "\t",
      encoding: "utf8",
      columns: true,
      // See: Issue #21
      relaxColumnCountLess: true,
    },
  );
  await inputLog.close();
  if (!parser || !Array.isArray(parsedLog)) {
    log({ log: parsedLog });
    throw new Error("unexpected CSV format");
  }
  return parser.parse(parsedLog);
}

export interface LogParserOptions {
  /** Path to where combat logs that have been split into separate CSV parts are temporarily stored. */
  splitLogsPath: string;
}

export interface LogParser {
  parse: (logPath: string) => Promise<CombatLogSegment[]>;
}

export function createLogParser({
  splitLogsPath,
}: LogParserOptions): LogParser {
  return {
    parse: async (logPath: string) => {
      const logs = await splitRawLog(logPath, splitLogsPath);
      log("log split into components", logs);
      const typedLogs = await Promise.all(
        logs.map(async (l) => await parseLog(l)),
      );
      typedLogs.forEach((l) => {
        if (l.type === "rounds") {
          log("%o", l.records);
        } else {
          log("%s: %O", l.type, l.records);
        }
      });
      fs.rm(splitLogsPath, { force: true, recursive: true }).catch(
        (err: Error) => {
          if (err) {
            log({ err });
          }
        },
      );
      return typedLogs;
    },
  };
}
