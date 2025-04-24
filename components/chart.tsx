"use client";

import {
  CandlestickSeries,
  createChart,
  ColorType,
  UTCTimestamp,
  TickMarkType,
  PriceScaleOptions,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import { formatFloor } from "@/lib/utils";

export function formatTickMarks(
  time: UTCTimestamp,
  tickMarkType: TickMarkType,
  locale: string
): string {
  const date = new Date(time.valueOf() * 1000);
  switch (tickMarkType) {
    case TickMarkType.Year:
      return date.toLocaleString(locale, { year: "numeric" });
    case TickMarkType.Month:
      return date.toLocaleString(locale, { month: "short", year: "numeric" });
    case TickMarkType.DayOfMonth:
      return date.toLocaleString(locale, { month: "short", day: "numeric" });
    case TickMarkType.Time:
      return date.toLocaleString(locale, {
        hour: "numeric",
        minute: "numeric",
      });
    case TickMarkType.TimeWithSeconds:
      return date.toLocaleString(locale, {
        hour: "numeric",
        minute: "numeric",
        second: "2-digit",
      });
    default:
      return date.toLocaleString(locale, {
        hour: "numeric",
        minute: "numeric",
        second: "2-digit",
      });
  }
}

export function Chart({
  data,
}: {
  data: {
    time: string | UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
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
      timeScale: {
        tickMarkFormatter: formatTickMarks,
        timeVisible: true,
        borderVisible: false,
        ticksVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });
    chart.timeScale().fitContent();

    // Set price formatter using the correct API
    chart.priceScale("right").applyOptions({});
    chart.applyOptions({
      localization: {
        priceFormatter: (price: number) => formatFloor(price),
      },
    });

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
