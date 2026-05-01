/**
 * Debug logger: captures React warnings (hydration, mismatch),
 * render errors, unhandled promise rejections, and long tasks.
 *
 * Logs are stored in window.__DEBUG_LOGS__ and printed with [DEBUG] prefix
 * so they're easy to find in the production console.
 *
 * Activate by visiting any page with ?debug=1 or by setting
 * localStorage.setItem('gm_debug', '1')
 */

type LogEntry = {
  t: number;
  level: "warn" | "error" | "info";
  source: string;
  message: string;
  stack?: string;
};

declare global {
  interface Window {
    __DEBUG_LOGS__?: LogEntry[];
    __DEBUG_INSTALLED__?: boolean;
    dumpDebug?: () => LogEntry[];
  }
}

const HYDRATION_KEYWORDS = [
  "hydrat",
  "did not match",
  "mismatch",
  "Text content does not match",
  "server rendered HTML",
  "Expected server HTML",
  "minified React error",
];

function isReactNoise(args: unknown[]): boolean {
  const msg = String(args[0] ?? "");
  return HYDRATION_KEYWORDS.some((k) => msg.toLowerCase().includes(k.toLowerCase()));
}

function shouldEnable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("debug") === "1") {
      localStorage.setItem("gm_debug", "1");
      return true;
    }
    return localStorage.getItem("gm_debug") === "1";
  } catch {
    return false;
  }
}

export function installDebugLogger(): void {
  if (typeof window === "undefined") return;
  if (window.__DEBUG_INSTALLED__) return;
  if (!shouldEnable()) return;
  window.__DEBUG_INSTALLED__ = true;

  const logs: LogEntry[] = [];
  window.__DEBUG_LOGS__ = logs;

  const push = (entry: LogEntry) => {
    logs.push(entry);
    if (logs.length > 500) logs.shift();
  };

  const origWarn = console.warn.bind(console);
  const origError = console.error.bind(console);

  console.warn = (...args: unknown[]) => {
    const message = args.map(String).join(" ");
    push({
      t: Date.now(),
      level: "warn",
      source: isReactNoise(args) ? "react-hydration" : "console.warn",
      message,
    });
    origWarn("[DEBUG]", ...args);
  };

  console.error = (...args: unknown[]) => {
    const message = args.map(String).join(" ");
    const err = args.find((a) => a instanceof Error) as Error | undefined;
    push({
      t: Date.now(),
      level: "error",
      source: isReactNoise(args) ? "react-hydration" : "console.error",
      message,
      stack: err?.stack,
    });
    origError("[DEBUG]", ...args);
  };

  window.addEventListener("error", (e) => {
    push({
      t: Date.now(),
      level: "error",
      source: "window.error",
      message: e.message,
      stack: e.error?.stack,
    });
    origError("[DEBUG] window.error", e.message, e.error);
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    push({
      t: Date.now(),
      level: "error",
      source: "unhandledrejection",
      message: reason?.message ?? String(reason),
      stack: reason?.stack,
    });
    origError("[DEBUG] unhandledrejection", reason);
  });

  // Long task detector — these often correlate with input freezes
  if (typeof PerformanceObserver !== "undefined") {
    try {
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            push({
              t: Date.now(),
              level: "warn",
              source: "longtask",
              message: `Long task ${Math.round(entry.duration)}ms`,
            });
            origWarn(`[DEBUG] long task ${Math.round(entry.duration)}ms`);
          }
        }
      });
      obs.observe({ entryTypes: ["longtask"] });
    } catch {
      /* noop */
    }
  }

  window.dumpDebug = () => logs.slice();

  origWarn(
    "[DEBUG] Logger activo. Ejecuta dumpDebug() en consola para ver todos los eventos. Desactiva con localStorage.removeItem('gm_debug')."
  );
}
