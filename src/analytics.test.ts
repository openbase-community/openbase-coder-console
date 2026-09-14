import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isAllowedAnalyticsEvent,
  productAnalyticsCollectionEnabled,
  sanitizeAnalyticsProperties,
  setProductAnalyticsEnabled,
} from "./analytics";

afterEach(() => vi.unstubAllGlobals());

describe("console product analytics", () => {
  it("keeps only canonical scalar measurements", () => {
    expect(
      sanitizeAnalyticsProperties({
        duration_ms: 4200,
        connected: true,
        outcome: null,
        prompt: "private prompt",
        repository_name: "private-repo",
        email: "private@example.com",
      }),
    ).toEqual({ duration_ms: 4200, connected: true, outcome: null });
  });

  it("accepts only canonical event names", () => {
    expect(isAllowedAnalyticsEvent("voice_call_connected")).toBe(true);
    expect(isAllowedAnalyticsEvent("private_prompt_copied")).toBe(false);
  });

  it("requires opt-in and honors privacy and build kill switches", () => {
    expect(productAnalyticsCollectionEnabled(true, null, false)).toBe(false);
    expect(productAnalyticsCollectionEnabled(true, "1", false)).toBe(true);
    expect(productAnalyticsCollectionEnabled(true, "0", false)).toBe(false);
    expect(productAnalyticsCollectionEnabled(false, "1", false)).toBe(false);
    expect(productAnalyticsCollectionEnabled(true, "1", true)).toBe(false);
  });

  it("removes the anonymous device id on opt-out", () => {
    const values = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        removeItem: (key: string) => values.delete(key),
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });

    values.set("openbase.analytics.device_id", "prior-opt-in-id");
    setProductAnalyticsEnabled(false);
    expect(values.get("openbase.analytics.enabled")).toBe("0");
    expect(values.has("openbase.analytics.device_id")).toBe(false);
  });
});
