import path from "path";
import fs from "fs";

export function readTestDataFile(relativePath: string) {
  const filePath = path.join("src/__tests__/__data__/", relativePath);
  return fs.readFileSync(filePath);
}
