import axios from "axios";
import useSWR from "swr";
import { Token } from "@/types/token";
import { useMemo } from "react";
import { SOL_ADDRESS } from "@/lib/constants";

export function useTokenBalance(token: Token | undefined) {
  const { data: portfolio } = useSWR(
    token ? `/api/portfolio/${token.address}` : undefined,
    (url: string) =>
      axios
        .get<{
          data: {
            walletBalance: {
              totalWorth: number;
              balances: {
                ata: string;
                mint: string;
                raw_value: string;
                usd_value: string;
              }[];
            };
          };
        }>(url)
        .then((res) => res.data.data)
  );

  const balance = useMemo(
    () =>
      portfolio
        ? portfolio.walletBalance.balances.find(
            (balance) =>
              (balance.mint == "" && token.address === SOL_ADDRESS) ||
              balance.mint === token.address
          )?.raw_value ?? "0"
        : undefined,
    [portfolio, token]
  );

  return balance;
}
