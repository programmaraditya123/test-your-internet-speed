"use client";
import React from "react";
import styles from "../styles/SpeedResults.module.css";

interface Props {
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  testing: boolean;
}

export default function SpeedResults({ ping, jitter, download, upload, testing }: Props) {
  return (
    <section className={styles.results}>
      <div className={styles.gaugeWrapper}>
        <div className={styles.gauge}>
          <div
            className={styles.needle}
            style={{
              transform: `rotate(${Math.min(download / 2, 180)}deg)`,
              transition: "transform 0.8s ease-in-out",
            }}
          />
          <div className={styles.centerCircle}>
            <h2>{testing ? "..." : `${download.toFixed(1)}`}</h2>
            <span>Mbps</span>
          </div>
        </div>
        <h3>Download Speed</h3>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h4>Upload</h4>
          <p>{upload ? `${upload.toFixed(1)} Mbps` : "—"}</p>
        </div>
        <div className={styles.metricCard}>
          <h4>Ping</h4>
          <p>{ping ? `${ping.toFixed(1)} ms` : "—"}</p>
        </div>
        <div className={styles.metricCard}>
          <h4>Jitter</h4>
          <p>{jitter ? `${jitter.toFixed(1)} ms` : "—"}</p>
        </div>
      </div>
    </section>
  );
}
