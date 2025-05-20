import { ChartType } from "@/types/chart";
import axios from "axios";
import { UTCTimestamp } from "lightweight-charts";
import useSWR from "swr";

export function useChartData(address: string | null, outputMint: string, chartType: ChartType) {
  const { data } = useSWR(
    address ? `/api/charts/${outputMint}?quote_address=${address}&type=${chartType}` : undefined,
    (url: string) =>
      axios
        .get<{
          data: {
            bars: { h: number; l: number; c: number; o: number; t: number }[];
          };
        }>(url)
        .then((res) => res.data.data)
  );

  return data?.bars.map(({ h, o, c, t, l }) => ({
    open: o,
    close: c,
    high: h,
    low: l,
    time: t as UTCTimestamp,
  }));
}
