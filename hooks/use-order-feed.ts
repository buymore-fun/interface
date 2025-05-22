import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useOrderList } from "@/hooks/services";
// Order feed list atoms
const orderFeedListAtom = atom<any[]>([]);
const orderFeedListLoadingAtom = atom<boolean>(false);
const orderFeedListErrorAtom = atom<Error | null>(null);

export function useOrderFeed(inputMint: string, outputMint: string) {
  const [orderFeedList, setOrderFeedList] = useAtom(orderFeedListAtom);
  const [isOrderFeedListLoading, setIsOrderFeedListLoading] = useAtom(orderFeedListLoadingAtom);
  const [orderFeedListError, setOrderFeedListError] = useAtom(orderFeedListErrorAtom);

  const { data, error, isLoading, mutate } = useOrderList({
    input_token: inputMint,
    output_token: outputMint,
  });

  useEffect(() => {
    if (data) {
      setOrderFeedList(data || []);
    }
  }, [data, setOrderFeedList]);

  useEffect(() => {
    setIsOrderFeedListLoading(isLoading);
  }, [isLoading, setIsOrderFeedListLoading]);

  useEffect(() => {
    if (error) {
      setOrderFeedListError(error instanceof Error ? error : new Error(String(error)));
    } else {
      setOrderFeedListError(null);
    }
  }, [error, setOrderFeedListError]);

  const fetchOrderFeed = useCallback(() => {
    return mutate(undefined, { revalidate: true });
  }, [mutate]);

  return {
    orderFeedList,
    isOrderFeedListLoading,
    orderFeedListError,
    fetchOrderFeed,
  };
}
