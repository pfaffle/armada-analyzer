import express from "express";
export const router = express.Router();

/* GET health check response. */
router.get("/", function (req, res, next) {
  res.status(204).send("");
});
