import express from "express";
export const router = express.Router();

/* GET test response. */
router.get("/", function (req, res, next) {
  res.send("hello, world!");
});
