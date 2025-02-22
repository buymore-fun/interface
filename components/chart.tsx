"use client";

import { CandlestickSeries, createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

export function Chart({
  data,
}: {
  data: { time: string; open: number; high: number; close: number }[];
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };
    if (!chartContainerRef.current) {
      return;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#111" },
        textColor: "#b3b5bd",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1e1e1f" },
        horzLines: { color: "#1e1e1f" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 360,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addSeries(CandlestickSeries);
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} />;
}
