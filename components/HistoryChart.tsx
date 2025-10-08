"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../styles/chart.module.css";

interface ChartData {
  id: number;
  download: number;
  upload: number;
  ping: number;
}

interface Props {
  history: ChartData[];
}

export default function HistoryChart({ history }: Props) {
  if (history.length === 0) return null;

  return (
    <div className={styles.chartContainer}>
      <h3>📊 Speed Test History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="download" stroke="#60a5fa" name="Download" />
          <Line type="monotone" dataKey="upload" stroke="#fbbf24" name="Upload" />
          <Line type="monotone" dataKey="ping" stroke="#34d399" name="Ping" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
