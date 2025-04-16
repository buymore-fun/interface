import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useActivityList, useMyOrderList, useTradeHistoryList } from "@/hooks/services";
import { useWallet } from "@solana/wallet-adapter-react";
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

  const { mutate: fetchActivityList } = useActivityList({
    input_token: inputMint,
    output_token: outputMint,
  });

  const fetchActivities = useCallback(async () => {
    // Prevent duplicate API calls
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsActivityListLoading(true);
    setActivityListError(null);

    try {
      const activities = await fetchActivityList();
      setActivityList(activities?.items || []);
      setTotalPage(activities?.total_page || 0);
    } catch (err) {
      console.error("Error fetching activity list:", err);
      setActivityListError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsActivityListLoading(false);
      isFetchingRef.current = false;
    }
  }, [
    fetchActivityList,
    setActivityList,
    setIsActivityListLoading,
    setActivityListError,
    setTotalPage,
  ]);

  // Call only once on initialization
  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    activityList,
    isActivityListLoading,
    activityListError,
    fetchActivities,
  };
}

export function useMyOrders(inputMint: string, outputMint: string) {
  const { publicKey } = useWallet();
  const [myOrderList, setMyOrderList] = useAtom(myOrderListAtom);
  const [isMyOrderListLoading, setIsMyOrderListLoading] = useAtom(myOrderListLoadingAtom);
  const [myOrderListError, setMyOrderListError] = useAtom(myOrderListErrorAtom);
  const [myOrderTotalPage, setMyOrderTotalPage] = useAtom(myOrderTotalPageAtom);
  const isFetchingRef = useRef(false);

  const { mutate: fetchMyOrderList } = useMyOrderList({
    input_token: inputMint,
    output_token: outputMint,
    address: publicKey?.toBase58() || "",
  });

  const fetchMyOrders = useCallback(async () => {
    if (!publicKey || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsMyOrderListLoading(true);
    setMyOrderListError(null);

    try {
      const orders = await fetchMyOrderList();
      console.log("🚀 ~ fetchMyOrders ~ orders:", orders);
      setMyOrderList(orders?.items || []);
      setMyOrderTotalPage(orders?.total_page || 0);
    } catch (err) {
      console.error("Error fetching my order list:", err);
      setMyOrderListError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsMyOrderListLoading(false);
      isFetchingRef.current = false;
    }
  }, [
    publicKey,
    fetchMyOrderList,
    setMyOrderList,
    setIsMyOrderListLoading,
    setMyOrderListError,
    setMyOrderTotalPage,
  ]);

  // Call only once on initialization
  useEffect(() => {
    if (publicKey) {
      fetchMyOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  return {
    myOrderList,
    isMyOrderListLoading,
    myOrderListError,
    fetchMyOrders,
  };
}

export function useTradeHistory(inputMint: string, outputMint: string) {
  const { publicKey } = useWallet();
  const [tradeHistoryList, setTradeHistoryList] = useAtom(tradeHistoryListAtom);
  const [isTradeHistoryListLoading, setIsTradeHistoryListLoading] = useAtom(
    tradeHistoryListLoadingAtom
  );
  const [tradeHistoryListError, setTradeHistoryListError] = useAtom(tradeHistoryListErrorAtom);
  const [tradeHistoryTotalPage, setTradeHistoryTotalPage] = useAtom(tradeHistoryTotalPageAtom);
  const isFetchingRef = useRef(false);

  const { mutate: fetchTradeHistoryList } = useTradeHistoryList({
    input_token: inputMint,
    output_token: outputMint,
    address: publicKey?.toBase58() || "",
  });

  const fetchTradeHistory = useCallback(async () => {
    if (!publicKey || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsTradeHistoryListLoading(true);
    setTradeHistoryListError(null);

    try {
      const history = await fetchTradeHistoryList();
      setTradeHistoryList(history?.items || []);
      setTradeHistoryTotalPage(history?.total_page || 0);
    } catch (err) {
      console.error("Error fetching trade history list:", err);
      setTradeHistoryListError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsTradeHistoryListLoading(false);
      isFetchingRef.current = false;
    }
  }, [
    publicKey,
    fetchTradeHistoryList,
    setTradeHistoryList,
    setIsTradeHistoryListLoading,
    setTradeHistoryListError,
    setTradeHistoryTotalPage,
  ]);

  // Call only once on initialization
  useEffect(() => {
    if (publicKey) {
      fetchTradeHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  return {
    tradeHistoryList,
    isTradeHistoryListLoading,
    tradeHistoryListError,
    fetchTradeHistory,
  };
}
