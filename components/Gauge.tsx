"use client";

import { useEffect, useState } from "react";
import styles from "../styles/gauge.module.css";

interface GaugeProps {
  label: string;
  value: number | null;
  max?: number;
  unit: string;
  color?: string;
}

export default function Gauge({
  label,
  value,
  max = 100,
  unit,
  color = "#4ade80",
}: GaugeProps) {
  const [angle, setAngle] = useState(-90); // Start from leftmost (empty)

  useEffect(() => {
    if (value !== null) {
      const clamped = Math.min(value, max);
      const newAngle = (clamped / max) * 180 - 90; // -90 to +90 degrees
      setAngle(newAngle);
    }
  }, [value, max]);

  return (
    <div className={styles.gaugeBox}>
      <div className={styles.gauge}>
        <svg viewBox="0 0 200 100" className={styles.gaugeSvg}>
          <path
            d="M20,100 A80,80 0 0,1 180,100"
            fill="none"
            stroke="#1f2937"
            strokeWidth="15"
          />
          <path
            d="M20,100 A80,80 0 0,1 180,100"
            fill="none"
            stroke={color}
            strokeWidth="15"
            strokeDasharray="283"
            strokeDashoffset={value ? 283 - (283 * value) / max : 283}
            strokeLinecap="round"
          />
          <g transform="translate(100,100)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-70"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              className={styles.needle}
              style={{
                transform: `rotate(${angle}deg)`,
                transition: "transform 0.8s ease-in-out",
              }}
            />
          </g>
        </svg>
      </div>
      <div className={styles.value}>{value ? `${value.toFixed(1)} ${unit}` : "—"}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
