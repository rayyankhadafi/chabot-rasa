import '@fontsource/inter';
import '@fontsource/sora';
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster position="top-right" richColors />
    <App />
  </>
);