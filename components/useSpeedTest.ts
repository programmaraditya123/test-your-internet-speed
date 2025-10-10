import { useState, useEffect } from "react";

type SpeedData = {
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  timestamp: string;
};

const API_BASE = "https://education-specific-ai-agent-710178903619.asia-south1.run.app";

export const useSpeedTest = () => {
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [history, setHistory] = useState<SpeedData[]>([]);
  const [testing, setTesting] = useState(false);

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
      await fetch(`${API_BASE}/ping?nocache=${Date.now()}`); // Create small ping endpoint
      const end = performance.now();
      results.push(end - start);
    }

    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    const jit =
      results.length > 1
        ? Math.sqrt(
            results
              .slice(1)
              .map((r, i) => Math.pow(r - results[i], 2))
              .reduce((a, b) => a + b, 0) / (results.length - 1)
          )
        : 0;

    setPing(Number(avg.toFixed(2)));
    setJitter(Number(jit.toFixed(2)));
    return { avg, jit };
  };

  // -----------------------------
  // Measure Download
  // -----------------------------
  const measureDownload = async () => {
    const start = performance.now();
    const response = await fetch(`${API_BASE}/download`);
    const reader = response.body?.getReader();

    let bytesReceived = 0;
    const startTime = performance.now();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      bytesReceived += value.length;
    }

    const endTime = performance.now();
    const durationSec = (endTime - startTime) / 1000;
    const speedMbps = ((bytesReceived * 8) / 1_000_000 / durationSec).toFixed(2);

    setDownload(Number(speedMbps));
    return Number(speedMbps);
  };

  // -----------------------------
  // Measure Upload
  // -----------------------------
  const measureUpload = async () => {
    const sizeMB = 25; // bigger file for more stable measurement
    const blob = new Blob([new Uint8Array(sizeMB * 1024 * 1024)]);
    const start = performance.now();
    await fetch(`${API_BASE}/upload`, { method: "POST", body: blob });
    const end = performance.now();

    const durationSec = (end - start) / 1000;
    const speedMbps = ((sizeMB * 8) / durationSec).toFixed(2);

    setUpload(Number(speedMbps));
    return Number(speedMbps);
  };

  const runFullTest = async () => {
    setTesting(true);
    setPing(0);
    setJitter(0);
    setDownload(0);
    setUpload(0);

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
