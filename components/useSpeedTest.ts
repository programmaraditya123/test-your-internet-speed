import { useState, useEffect } from "react";

type SpeedData = {
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  timestamp: string;
};

// const API_BASE = "http://localhost:8000"; 
const API_BASE = "https://education-specific-ai-agent-710178903619.asia-south1.run.app"

export const useSpeedTest = () => {
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [history, setHistory] = useState<SpeedData[]>([]);
  const [testing, setTesting] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("speedHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // -----------------------------
  // Measure Ping & Jitter
  // -----------------------------
  const measurePing = async (attempts = 5) => {
    const results: number[] = [];
    for (let i = 0; i < attempts; i++) {
      const start = performance.now();
      await fetch("https://1.1.1.1/cdn-cgi/trace", { mode: "no-cors" });
      const end = performance.now();
      results.push(end - start);
    }
    const avg = results.reduce((a, b) => a + b) / results.length;
    const jit =
      results.length > 1
        ? Math.sqrt(
            results
              .slice(1)
              .map((r, i) => Math.pow(r - results[i], 2))
              .reduce((a, b) => a + b) /
              (results.length - 1)
          )
        : 0;

    setPing(Number(avg.toFixed(2)));
    setJitter(Number(jit.toFixed(2)));
    return { avg, jit };
  };

  // -----------------------------
  // Measure Download with concurrency
  // -----------------------------
  const measureDownload = async () => {
    const files = Array(4).fill(`${API_BASE}/download`);
    const start = performance.now();
    await Promise.all(files.map((url) => fetch(url)));
    const end = performance.now();

    const bytes = 4 * 50 * 1024 * 1024; // 4 x 50 MB
    const timeSec = (end - start) / 1000;
    const speedMbps = ((bytes * 8) / 1_000_000 / timeSec).toFixed(2);

    setDownload(Number(speedMbps));
    return Number(speedMbps);
  };

  // -----------------------------
  // Measure Upload
  // -----------------------------
  const measureUpload = async () => {
    const sizeMB = 10;
    const blob = new Blob([new Uint8Array(sizeMB * 1024 * 1024)]);
    const start = performance.now();
    await fetch(`${API_BASE}/upload`, { method: "POST", body: blob });
    const end = performance.now();

    const timeSec = (end - start) / 1000;
    const speedMbps = ((sizeMB * 8) / timeSec).toFixed(2);

    setUpload(Number(speedMbps));
    return Number(speedMbps);
  };

  // -----------------------------
  // Run Full Test
  // -----------------------------
  const runFullTest = async () => {
    setTesting(true);
    setPing(0);
    setJitter(0);
    setDownload(0);
    setUpload(0);

    // Run sequentially
    const { avg, jit } = await measurePing();
    const dl = await measureDownload();
    const ul = await measureUpload();

    const result: SpeedData = {
      ping: Number(avg.toFixed(2)),
      jitter: Number(jit.toFixed(2)),
      download: dl,
      upload: ul,
      timestamp: new Date().toLocaleString(),
    };

    setHistory((prev) => {
      const newHistory = [result, ...prev].slice(0, 10);
      localStorage.setItem("speedHistory", JSON.stringify(newHistory));
      return newHistory;
    });

    setTesting(false);
  };

  return {
    ping,
    jitter,
    download,
    upload,
    history,
    testing,
    runFullTest,
  };
};
