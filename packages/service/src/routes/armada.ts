import express from "express";
import multer from "multer";
import debug from "debug";
import fs from "fs";
import { LogParser } from "../logParser.js";

const log = debug("app:route:armada");

export interface ArmadaRouterOptions {
  /** Path to where files uploaded to the /armada/upload endpoint are temporarily stored. */
  uploadsPath: string;
  /** Handles parsing the CSV file into structured objects so we can produce useful stats from it. */
  logParser: LogParser;
}

export function createRouter({ uploadsPath, logParser }: ArmadaRouterOptions) {
  const handleUpload = multer({
    dest: uploadsPath,
    limits: {
      fields: 0,
      files: 1,
      fileSize: 5 * 1024 * 1024, // 5mb
    },
  }).single("file");
  const router = express.Router();

  router.post("/upload", async (req, res, next) =>
    handleUpload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        log({ err });
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(413).send();
        } else {
          res.status(400).send();
        }
      } else if (err) {
        next(err);
      } else {
        if (!req.file) {
          res.status(400).send();
        } else {
          log("received file", req.file);
          try {
            const logs = await logParser.parse(req.file.path);
            res.status(200).send({ status: "success" });
          } catch (parseError) {
            log({ parseError });
            res.status(422).send();
          }
          // clean up files when we aren't using them
          fs.rm(req.file.path, (err) => {
            if (err) {
              log({ err });
            }
          });
        }
      }
    }),
  );
  return router;
}
