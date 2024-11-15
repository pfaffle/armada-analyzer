import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { Provider } from "@/components/ui/provider";

async function enableMocks() {
  if (import.meta.env.VITE_ENABLE_MOCKS === "0") {
    return;
  }
  const { worker } = await import("./mocks/browser.ts");
  return worker.start();
}

enableMocks()
  .then(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <Provider>
          <App />
        </Provider>
      </StrictMode>,
    );
  })
  .catch((err: Error) => {
    console.error({ err });
  });
