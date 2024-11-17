import path from "path";
import fs from "fs";

export function getTestDataFile(relativePath: string) {
  return path.join("src/__tests__/__data__/", relativePath);
}
export function readTestDataFile(relativePath: string) {
  return fs.readFileSync(getTestDataFile(relativePath));
}
