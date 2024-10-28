import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import url from "url";

function initApp() {
  const app = express();
  const dirname = path.dirname(url.fileURLToPath(import.meta.url));
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(dirname, "public")));
  app.get("/healthz", (req, res, next) => {
    res.status(204).send();
  });

  return app;
}

export { initApp };
