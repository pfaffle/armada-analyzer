export const apiUrl = (path: string) =>
  new URL(path, import.meta.env.VITE_API_URL).href;
