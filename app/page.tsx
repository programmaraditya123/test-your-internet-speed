"use client";

import { useEffect, useState } from "react";
import { useSpeedTest } from "@/components/useSpeedTest";
import SpeedResults from "@/components/SpeedResults";
import HistoryChart from "@/components/HistoryChart";
import styles from "./page.module.css";

interface HistoryItem {
  id: number;
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  timestamp: string;
}

export default function Page() {
  const {
    ping,
    jitter,
    download,
    upload,
    history: testHistory,
    testing,
    runFullTest,
  } = useSpeedTest();

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 🧠 Load previous history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("speedHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // 💾 Save whenever local history updates
  useEffect(() => {
    if (history.length > 0)
      localStorage.setItem("speedHistory", JSON.stringify(history));
  }, [history]);

  // 🚀 Start test & record results
  const handleStart = async () => {
    await runFullTest();
    setHistory((prev) => [
      {
        id: prev.length + 1,
        ping,
        jitter,
        download,
        upload,
        timestamp: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  // 📊 Insight calculations
  const avg = (key: keyof HistoryItem) =>
    history.length > 0
      ? (
          history.reduce((a, b) => a + (b[key] as number), 0) / history.length
        ).toFixed(1)
      : "—";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>🚀 Internet Speed Analyzer</h1>
        <p className={styles.subtext}>
          Real-time, browser-based test. No backend. No limits.
        </p>

        <button
          onClick={handleStart}
          disabled={testing}
          className={testing ? styles.btnDisabled : styles.btn}
        >
          {testing ? "Testing..." : "Start Speed Test"}
        </button>
      </header>

      <main className={styles.main}>
        <SpeedResults
          ping={ping}
          jitter={jitter}
          download={download}
          upload={upload}
          testing={testing}
        />

        <section className={styles.historySection}>
          <h2>📈 Test History</h2>
          <HistoryChart history={history} />
        </section>

        <section className={styles.insights}>
          <h3>💡 Performance Insights</h3>
          <div className={styles.statsGrid}>
            <div>
              <h4>Avg Download</h4>
              <p>{avg("download")} Mbps</p>
            </div>
            <div>
              <h4>Avg Upload</h4>
              <p>{avg("upload")} Mbps</p>
            </div>
            <div>
              <h4>Avg Ping</h4>
              <p>{avg("ping")} ms</p>
            </div>
            <div>
              <h4>Avg Jitter</h4>
              <p>{avg("jitter")} ms</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} Internet Speed Analyzer | Crafted by{" "}
          <strong>Aditya ⚡</strong>
        </p>
      </footer>
    </div>
  );
}
