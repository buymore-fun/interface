import axios from "axios";
import useSWR from "swr";
import { Token } from "@/types/token";
import { SOL_ADDRESS } from "@/lib/constants";

export function useToken(address: string | null) {
  const { data } = useSWR(
    address ? `/api/tokens/${address === "SOL" ? SOL_ADDRESS : address}` : undefined,
    (url: string) =>
      axios
        .get<{
          data: Token;
        }>(url)
        .then((res) => res.data.data),
    {
      revalidateOnFocus: false,
    }
  );

  // TODO change to env
  if (address !== SOL_ADDRESS) {
    return {
      address: address,
      symbol: "BOB",
      icon: "https://dd.dexscreener.com/ds-data/tokens/solana/DL9sLSN488yMbots3wsbzHZ3UpKSkM42kr1y13CPpump.png?size=lg&key=91c469",
      priceUsd: "0",
      priceChange24h: 0,
    } as Token;
  }

  return data;
}
