import { createRoot } from "react-dom/client";
import App from "@openbase/coder-react/App";
import { PluginRegistryProvider } from "@openbase/coder-react/plugin-registry";
import "@openbase/coder-react/index.css";

createRoot(document.getElementById("root")!).render(
  <PluginRegistryProvider>
    <App />
  </PluginRegistryProvider>
);
