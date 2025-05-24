import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useActivityList, useMyOrderList, useTradeHistoryList } from "@/hooks/services";
// import { useWallet } from "@solana/wallet-adapter-react";
import { usePrivyWallet } from "@/hooks/use-privy-wallet";
// Activity list atoms
const activityListAtom = atom<any[]>([]);
const activityListLoadingAtom = atom<boolean>(false);
const activityListErrorAtom = atom<Error | null>(null);
const totalPageAtom = atom<number>(0);

// My order list atoms
const myOrderListAtom = atom<any[]>([]);
const myOrderListLoadingAtom = atom<boolean>(false);
const myOrderListErrorAtom = atom<Error | null>(null);
const myOrderTotalPageAtom = atom<number>(0);

// Trade history list atoms
const tradeHistoryListAtom = atom<any[]>([]);
const tradeHistoryListLoadingAtom = atom<boolean>(false);
const tradeHistoryListErrorAtom = atom<Error | null>(null);
const tradeHistoryTotalPageAtom = atom<number>(0);

export function useActivities(inputMint: string, outputMint: string) {
  const [activityList, setActivityList] = useAtom(activityListAtom);
  const [isActivityListLoading, setIsActivityListLoading] = useAtom(activityListLoadingAtom);
  const [activityListError, setActivityListError] = useAtom(activityListErrorAtom);
  const [totalPage, setTotalPage] = useAtom(totalPageAtom);
  const isFetchingRef = useRef(false);

  const { data, error, isLoading, mutate } = useActivityList({
    input_token: inputMint,
    output_token: outputMint,
  });

  useEffect(() => {
    if (data) {
      setActivityList(data.items || []);
      setTotalPage(data.total_page || 0);
    }
  }, [data, setActivityList, setTotalPage]);

  useEffect(() => {
    setIsActivityListLoading(isLoading);
  }, [isLoading, setIsActivityListLoading]);

  useEffect(() => {
    if (error) {
      setActivityListError(error instanceof Error ? error : new Error(String(error)));
    } else {
      setActivityListError(null);
    }
  }, [error, setActivityListError]);

  const fetchActivities = useCallback(() => {
    return mutate(undefined, { revalidate: true });
  }, [mutate]);

  return {
    activityList,
    isActivityListLoading,
    activityListError,
    fetchActivities,
  };
}

export function useMyOrders(inputMint: string, outputMint: string) {
  // const { publicKey } = useWallet();
  const { publicKey } = usePrivyWallet();
  const [myOrderList, setMyOrderList] = useAtom(myOrderListAtom);
  const [isMyOrderListLoading, setIsMyOrderListLoading] = useAtom(myOrderListLoadingAtom);
  const [myOrderListError, setMyOrderListError] = useAtom(myOrderListErrorAtom);
  const [myOrderTotalPage, setMyOrderTotalPage] = useAtom(myOrderTotalPageAtom);

  const { data, error, isLoading, mutate } = useMyOrderList({
    input_token: inputMint,
    output_token: outputMint,
    address: publicKey?.toBase58() || "",
  });

  useEffect(() => {
    if (data) {
      console.log("🚀 ~ useMyOrders ~ SWR data updated:", data);
      setMyOrderList(data.items || []);
      setMyOrderTotalPage(data.total_page || 0);
    }
  }, [data, setMyOrderList, setMyOrderTotalPage]);

  useEffect(() => {
    setIsMyOrderListLoading(isLoading);
  }, [isLoading, setIsMyOrderListLoading]);

  useEffect(() => {
    if (error) {
      setMyOrderListError(error instanceof Error ? error : new Error(String(error)));
    } else {
      setMyOrderListError(null);
    }
  }, [error, setMyOrderListError]);

  const fetchMyOrders = useCallback(
    (shouldRevalidate: boolean = false) => {
      console.log(
        "🚀 ~ fetchMyOrders ~ triggering SWR revalidation",
        shouldRevalidate ? "(forced)" : ""
      );
      return mutate(undefined, { revalidate: true });
    },
    [mutate]
  );

  return {
    myOrderList,
    isMyOrderListLoading,
    myOrderListError,
    fetchMyOrders,
  };
}

export function useTradeHistory(inputMint: string, outputMint: string) {
  // const { publicKey } = useWallet();
  const { publicKey } = usePrivyWallet();
  const [tradeHistoryList, setTradeHistoryList] = useAtom(tradeHistoryListAtom);
  const [isTradeHistoryListLoading, setIsTradeHistoryListLoading] = useAtom(
    tradeHistoryListLoadingAtom
  );
  const [tradeHistoryListError, setTradeHistoryListError] = useAtom(tradeHistoryListErrorAtom);
  const [tradeHistoryTotalPage, setTradeHistoryTotalPage] = useAtom(tradeHistoryTotalPageAtom);

  const { data, error, isLoading, mutate } = useTradeHistoryList({
    input_token: inputMint,
    output_token: outputMint,
    address: publicKey?.toBase58() || "",
  });

  useEffect(() => {
    if (data) {
      setTradeHistoryList(data.items || []);
      setTradeHistoryTotalPage(data.total_page || 0);
    }
  }, [data, setTradeHistoryList, setTradeHistoryTotalPage]);

  useEffect(() => {
    setIsTradeHistoryListLoading(isLoading);
  }, [isLoading, setIsTradeHistoryListLoading]);

  useEffect(() => {
    if (error) {
      setTradeHistoryListError(error instanceof Error ? error : new Error(String(error)));
    } else {
      setTradeHistoryListError(null);
    }
  }, [error, setTradeHistoryListError]);

  const fetchTradeHistory = useCallback(() => {
    return mutate(undefined, { revalidate: true });
  }, [mutate]);

  return {
    tradeHistoryList,
    isTradeHistoryListLoading,
    tradeHistoryListError,
    fetchTradeHistory,
  };
}
