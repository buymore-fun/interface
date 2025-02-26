import axios from "axios";
import useSWR from "swr";
import { Token } from "@/types/token";

export function useToken(address: string | null) {
  const { data } = useSWR(
    address ? `/api/tokens/${address}` : undefined,
    (url: string) =>
      axios
        .get<{
          data: Token;
        }>(url)
        .then((res) => res.data.data)
  );

  return data;
}
