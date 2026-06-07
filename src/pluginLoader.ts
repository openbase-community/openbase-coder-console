import {
  resolvePluginRegistry,
  type PluginConsolePage,
  type PluginProjectView,
  type PluginRegistryModule,
} from "@openbase/coder-react/plugin-registry";

const generated = import.meta.glob("./generated/pluginRegistry.ts", {
  eager: true,
}) as Record<string, PluginRegistryModule>;

const registry = resolvePluginRegistry(generated, "./generated/pluginRegistry.ts");

export const pluginConsolePages: PluginConsolePage[] =
  registry.pluginConsolePages;

export const pluginProjectViews: PluginProjectView[] =
  registry.pluginProjectViews;
