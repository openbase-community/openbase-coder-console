import { createRoot } from "react-dom/client";
import App from "@openbase/coder-react/App";
import { AppearanceProvider } from "@openbase/coder-react/appearance";
import { PluginRegistryProvider } from "@openbase/coder-react/plugin-registry";
import { configureProductAnalytics } from "@openbase/coder-react/product-analytics";
import "@openbase/coder-react/index.css";
import { productAnalytics } from "./analytics";

configureProductAnalytics(productAnalytics);
productAnalytics.trackSessionStartedOnce();

createRoot(document.getElementById("root")!).render(
  <AppearanceProvider>
    <PluginRegistryProvider>
      <App />
    </PluginRegistryProvider>
  </AppearanceProvider>
);
