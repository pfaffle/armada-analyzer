import express from "express";
import multer from "multer";
import debug from "debug";
import fs from "fs";
import { parseLog, splitRawLog } from "../logParser.js";

const log = debug("app:armada");

// planned components:
// route handler
//  - takes uploaded file, does basic error checking (size, type)
//  - writes to upload dir
//  - kicks off remaining components
//    - note: this could be made more async/event-driven but that seems like overkill
// log splitter
//  - takes uploaded file as input, and an output dir
//  - writes split files to output dir
// log parser
//  - takes split files as input
//  - parses files into data structures
// stats generator
//  - takes combat log data structures and generates useful stats
//  - returns stats to user

export interface ArmadaRouterOptions {
  /** Path to where files uploaded to the /armada/upload endpoint are temporarily stored. */
  uploadsPath: string;
  /** Path to where combat logs that have been split into separate CSV parts are temporarily stored. */
  splitLogsPath: string;
}

export function createRouter({
  uploadsPath,
  splitLogsPath,
}: ArmadaRouterOptions) {
  const handleUpload = multer({
    dest: uploadsPath,
    limits: {
      fields: 0,
      files: 1,
      fileSize: 5 * 1024 * 1024, // 5mb
    },
  }).single("file");
  const router = express.Router();

  router.post("/upload", async (req, res, next) => {
    return handleUpload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        log({ err });
        res.status(400).send();
      } else if (err) {
        next(err);
      } else {
        if (!req.file) {
          res.status(400).send();
        } else {
          log("received file", req.file);
          const logs = await splitRawLog(req.file.path, splitLogsPath);
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
          res.status(200).send({ status: "success" });

          // clean up files when we aren't using them
          fs.rm(req.file.path, (err) => {
            if (err) {
              log({ err });
            }
          });
          fs.rm(splitLogsPath, { force: true, recursive: true }, (err) => {
            if (err) {
              log({ err });
            }
          });
        }
      }
    });
  });
  return router;
}
