import { createRoot } from "react-dom/client";
import App from "@openbase/coder-react/App";
import { PluginRegistryProvider } from "@openbase/coder-react/plugin-registry";
import "@openbase/coder-react/index.css";
import { pluginConsolePages, pluginProjectViews } from "./pluginLoader";

const originalError = console.error;
console.error = (...args) => {
  // TODO: Pass error to Openbase
  originalError(...args); // Pass through all other errors
};

createRoot(document.getElementById("root")!).render(
  <PluginRegistryProvider
    pluginConsolePages={pluginConsolePages}
    pluginProjectViews={pluginProjectViews}
  >
    <App />
  </PluginRegistryProvider>
);
