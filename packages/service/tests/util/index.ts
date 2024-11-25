import path from "path";
import fs from "fs";

export function getTestDataFile(relativePath: string) {
  return path.join("tests/data/", relativePath);
}
export function readTestDataFile(relativePath: string) {
  return fs.readFileSync(getTestDataFile(relativePath));
}
