import fs from "fs/promises";
import path from "path";

export interface CombatLogSegment {
  filePath: string;
}

export async function splitRawLog(logPath: string, outputDir: string) {
  await fs.mkdir(outputDir, { recursive: true });
  const outFileBaseName = path.basename(logPath, ".csv");
  const inputLog = await fs.open(logPath);
  let i = 1;
  let writingFile = true;
  let outFile = path.join(outputDir, `${outFileBaseName}-${i}.csv`);
  let outputLog = await fs.open(outFile, "w+");
  let outputFiles: CombatLogSegment[] = [{ filePath: outFile }];
  for await (const line of inputLog.readLines()) {
    if (line === "") {
      // end of a raw log segment
      writingFile = false;
    } else {
      if (writingFile) {
        await outputLog.writeFile(`${line}\n`);
      } else {
        // close csv, start writing new csv
        await outputLog.close();
        i = i + 1;
        outFile = path.join(outputDir, `${outFileBaseName}-${i}.csv`);
        outputLog = await fs.open(outFile, "w+");
        outputFiles = outputFiles.concat([{ filePath: outFile }]);
        writingFile = true;
      }
    }
  }
  await inputLog.close();
  await outputLog.close();
  return outputFiles;
}
export function parseLog(log: File) {
  return {};
}
