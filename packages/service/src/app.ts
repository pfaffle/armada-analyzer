import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

function initApp() {
  const app = express();
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.get("/healthz", (req, res, next) => {
    res.status(204).send();
  });

  return app;
}

export { initApp };
