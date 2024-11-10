import { http, HttpResponse } from "msw";
import { apiUrl } from "./utils";

export const handlers = [
  http.post(apiUrl("/armada/upload"), () =>
    HttpResponse.json({ status: "success" }),
  ),
];
