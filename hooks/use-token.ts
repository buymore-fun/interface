import axios from "axios";
import useSWR from "swr";
import { Token } from "@/types/token";
import { SOL_ADDRESS } from "@/lib/constants";

export function useToken(address: string | null) {
  const { data } = useSWR(
    address
      ? `/api/tokens/${address === "SOL" ? SOL_ADDRESS : address}`
      : undefined,
    (url: string) =>
      axios
        .get<{
          data: Token;
        }>(url)
        .then((res) => res.data.data)
  );

  return data;
}
