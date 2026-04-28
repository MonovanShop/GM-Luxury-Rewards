import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";

export const Route = createFileRoute("/diag")({
  head: () => ({
    meta: [
      { title: "Diagnóstico de rendimiento" },
      { name: "description", content: "Mide FPS y latencia de tipeo en producción." },
      { name: "robots", content: "noindex, nofollow" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
    ],
  }),
  component: DiagPage,
});

function DiagPage() {
  const [fps, setFps] = useState(0);
  const [minFps, setMinFps] = useState(60);
  const [avgLatency, setAvgLatency] = useState(0);
  const [maxLatency, setMaxLatency] = useState(0);
  const [keyCount, setKeyCount] = useState(0);
  const [longTasks, setLongTasks] = useState(0);
  const [memory, setMemory] = useState<string>("n/d");
  const [logs, setLogs] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const latenciesRef = useRef<number[]>([]);
  const keyDownTimeRef = useRef<number>(0);

  // FPS meter
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    let localMin = 60;

    const tick = (now: number) => {
      frames++;
      const delta = now - last;
      if (delta >= 500) {
        const currentFps = Math.round((frames * 1000) / delta);
        setFps(currentFps);
        if (currentFps < localMin) {
          localMin = currentFps;
          setMinFps(currentFps);
        }
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Long tasks observer
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;
    let count = 0;
    try {
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          count++;
          setLongTasks(count);
          setLogs((prev) => [
            `⚠️ longtask ${Math.round(entry.duration)}ms`,
            ...prev.slice(0, 19),
          ]);
        }
      });
      obs.observe({ entryTypes: ["longtask"] });
      return () => obs.disconnect();
    } catch {
      /* noop */
    }
  }, []);

  // Memory polling
  useEffect(() => {
    const id = setInterval(() => {
      // @ts-expect-error - non-standard
      const m = performance.memory;
      if (m) {
        setMemory(
          `${Math.round(m.usedJSHeapSize / 1048576)}MB / ${Math.round(
            m.jsHeapSizeLimit / 1048576
          )}MB`
        );
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleKeyDown = useCallback(() => {
    keyDownTimeRef.current = performance.now();
  }, []);

  const handleInput = useCallback(() => {
    if (!keyDownTimeRef.current) return;
    const latency = performance.now() - keyDownTimeRef.current;
    latenciesRef.current.push(latency);
    if (latenciesRef.current.length > 100) latenciesRef.current.shift();

    const arr = latenciesRef.current;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const max = Math.max(...arr);
    setAvgLatency(Math.round(avg * 10) / 10);
    setMaxLatency(Math.round(max * 10) / 10);
    setKeyCount((c) => c + 1);
    keyDownTimeRef.current = 0;
  }, []);

  const stress = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let i = 0;
    const id = setInterval(() => {
      if (!inputRef.current) return clearInterval(id);
      const ch = chars[Math.floor(Math.random() * chars.length)];
      inputRef.current.value += ch;
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      i++;
      if (i >= 50) clearInterval(id);
    }, 30);
  }, []);

  const reset = useCallback(() => {
    latenciesRef.current = [];
    setFps(0);
    setMinFps(60);
    setAvgLatency(0);
    setMaxLatency(0);
    setKeyCount(0);
    setLongTasks(0);
    setLogs([]);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const fpsColor = fps >= 50 ? "#10b981" : fps >= 30 ? "#f59e0b" : "#ef4444";
  const latColor =
    avgLatency < 16 ? "#10b981" : avgLatency < 50 ? "#f59e0b" : "#ef4444";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        padding: 16,
      }}
    >
      <h1 style={{ fontSize: 18, margin: "0 0 12px" }}>📊 Diagnóstico</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Card label="FPS actual" value={fps} color={fpsColor} />
        <Card label="FPS mínimo" value={minFps} color={fpsColor} />
        <Card
          label="Latencia avg"
          value={`${avgLatency}ms`}
          color={latColor}
        />
        <Card label="Latencia max" value={`${maxLatency}ms`} color={latColor} />
        <Card label="Teclas" value={keyCount} color="#60a5fa" />
        <Card label="Long tasks" value={longTasks} color={longTasks ? "#ef4444" : "#10b981"} />
      </div>

      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
        Memoria JS: {memory}
      </div>

      <label style={{ fontSize: 12, opacity: 0.8 }}>
        Escribí acá para medir latencia:
      </label>
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="ABC123..."
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        style={{
          width: "100%",
          fontSize: 18,
          padding: 12,
          marginTop: 6,
          marginBottom: 12,
          borderRadius: 8,
          border: "1px solid #333",
          background: "#111",
          color: "#fff",
          textTransform: "uppercase",
        }}
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={stress}
          style={{
            flex: 1,
            padding: 12,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          🔥 Stress test (50 teclas)
        </button>
        <button
          onClick={reset}
          style={{
            padding: 12,
            background: "#374151",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: 8,
          padding: 8,
          fontSize: 11,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        <div style={{ opacity: 0.6, marginBottom: 4 }}>Eventos:</div>
        {logs.length === 0 ? (
          <div style={{ opacity: 0.4 }}>(sin long tasks detectados)</div>
        ) : (
          logs.map((l, i) => (
            <div key={i} style={{ color: "#fbbf24" }}>
              {l}
            </div>
          ))
        )}
      </div>

      <div style={{ fontSize: 11, opacity: 0.5, marginTop: 16, lineHeight: 1.5 }}>
        Verde: OK · Ámbar: aceptable · Rojo: problema.<br />
        FPS objetivo ≥50 · Latencia objetivo &lt;16ms · 0 long tasks al tipear.
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: 8,
        padding: 10,
      }}
    >
      <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
