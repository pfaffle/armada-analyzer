import path from "path";

export function getTestDataFile(relativePath: string) {
  return path.join("tests/data/", relativePath);
}
