import { http, HttpResponse } from "msw";

const apiUrl = (path: string) =>
  new URL(path, import.meta.env.VITE_API_URL).href;

export const handlers = [
  http.post(apiUrl("/armada/upload"), () =>
    HttpResponse.json({ status: "success" }),
  ),
];
