import { afterEach, describe, expect, it, vi } from "vitest";
import { reportLovableError } from "@/lib/lovable-error-reporting";

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.__lovableEvents;
  delete window.__lovableReportRuntimeError;
});

describe("Virheraportoinnin tietosuoja", () => {
  it("tuotannossa ei kutsuta ulkoisia virheraportointikoukkuja", () => {
    vi.stubEnv("DEV", false);
    const capture = vi.fn();
    const report = vi.fn();
    window.__lovableEvents = { captureException: capture };
    window.__lovableReportRuntimeError = report;
    reportLovableError(new Error("earned=12345"), { data: "financial-input" });
    expect(capture).not.toHaveBeenCalled();
    expect(report).not.toHaveBeenCalled();
  });
  it("esikatselun diagnostiikka ei sisällä syötteitä tai alkuperäistä virhettä", () => {
    vi.stubEnv("DEV", true);
    const capture = vi.fn();
    const report = vi.fn();
    window.__lovableEvents = { captureException: capture };
    window.__lovableReportRuntimeError = report;
    reportLovableError(new Error("earned=12345"), { data: "financial-input" });
    expect(capture).toHaveBeenCalledTimes(1);
    expect((capture.mock.calls[0]?.[0] as Error).message).toBe(
      "Laskurin näkymässä tapahtui virhe.",
    );
    expect(capture.mock.calls[0]?.[1]).toEqual({ source: "react_error_boundary", route: "/" });
    expect(report).toHaveBeenCalledWith({
      message: "Laskurin näkymässä tapahtui virhe.",
      filename: "/",
    });
  });
});
