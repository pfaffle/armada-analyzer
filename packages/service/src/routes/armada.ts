import express from "express";
import multer from "multer";
import debug from "debug";
import fs from "fs";
const log = debug("app:armada");
const handleUpload = multer({
  dest: "/tmp/uploads",
  limits: {
    fields: 0,
    files: 1,
    fileSize: 5 * 1024 * 1024, // 5mb
  },
}).single("file");
const router = express.Router();

router.post("/upload", (req, res, next) => {
  return handleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      log({ err });
      res.status(400).send();
    } else if (err) {
      next(err);
    } else {
      if (!req.file) {
        res.status(400).send();
      } else {
        log("Received file", req.file);
        res.status(200).send({ status: "success" });
        fs.rm(req.file.path, (err) => {
          if (err) {
            log({ err });
          }
        });
      }
    }
  });
});

export { router };
