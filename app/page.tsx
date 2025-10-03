"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";

const BASE_URL=process.env.NEXT_PUBLIC_PYTHON2_API

export default function Home() {
  const [speedData, setSpeedData] = useState<any>(null);
  const [servers, setServers] = useState<any[]>([]);

  // Fetch speed test data
  const fetchSpeedData = async () => {
    try {
      const response = await axios.get(`https://education-specific-ai-agent-710178903619.asia-south1.run.app/speedtest`);
      setSpeedData(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch server list
  const fetchServers = async () => {
    try {
      const response = await axios.get(`https://education-specific-ai-agent-710178903619.asia-south1.run.app/get_servers`);
      setServers(response.data.servers || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSpeedData();
    fetchServers();
  }, []);

  if (!speedData) {
    return <div className={styles.loading}>Loading ...</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>🌐 Internet Speed Test</h1>
      </header>

      <section className={styles.speedResults}>
        <h2>Speed Test Results</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Download</h3>
            <p>{speedData.download_speed} Mbps</p>
          </div>
          <div className={styles.card}>
            <h3>Upload</h3>
            <p>{speedData.upload_speed} Mbps</p>
          </div>
          <div className={styles.card}>
            <h3>Ping</h3>
            <p>{speedData.ping} ms</p>
          </div>
          <div className={styles.card}>
            <h3>ISP</h3>
            <p>{speedData.isp}</p>
          </div>
        </div>

        <div className={styles.serverInfo}>
          <h3>Server Location</h3>
          <p>
            {speedData.server.name}, {speedData.server.country}
          </p>
          <p>
            Latitude: {speedData.server.lat}, Longitude: {speedData.server.lon}
          </p>
        </div>
      </section>

      <section className={styles.serverList}>
        <h2>Available Speedtest Servers</h2>
        {servers.length === 0 ? (
          <p>No servers available.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Host</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Sponsor</th>
                  <th>Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((server) => (
                  <tr key={server.id}>
                    <td>{server.id}</td>
                    <td>{server.host}</td>
                    <td>{server.name}</td>
                    <td>{server.country}</td>
                    <td>{server.sponsor}</td>
                    <td>{server.distance?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <p>© 2025 My Speed Test App</p>
      </footer>
    </div>
  );
}
