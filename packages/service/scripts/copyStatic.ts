import fs from "fs";
// TODO do i need a separate tsconfig for scripts?

if (!fs.existsSync("dist/public")) {
  fs.mkdirSync("dist/public", { recursive: true });
}
fs.cpSync("src/public/", "dist/public/", { recursive: true });
