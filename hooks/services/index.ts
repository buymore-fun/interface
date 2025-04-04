import { OrderType } from "@/consts/order";
import {
  IResponseActivityList,
  IResponseCommunityDetail,
  IResponseDashboardIndex,
  IResponseMyOrderList,
  IResponseOrderbookDepth,
  IResponseTradeHistoryList,
  IResponsePoolInfoItem,
} from "@/types";
import axios from "axios";
import useSWR from "swr";

const BASE_URL = "https://api-test.buymore.fun/usurper";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// done
// https://api-test.buymore.fun/usurper/dashboard/index?input_mint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&tt=all
export function useDashboardIndex(params: { inputMint: string; tt?: string }) {
  const { data, error, isLoading } = useSWR(`/dashboard/index`, async (url: string) => {
    const response = await axiosInstance.get(url, {
      params,
    });
    return response.data?.data as IResponseDashboardIndex;
  });

  return {
    data,
    error,
    isLoading,
  };
}

// done
// https://api-test.buymore.fun/usurper/activity/list?input_mint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
export function useActivityList(params: { inputMint: string }) {
  const { data, error, isLoading, mutate } = useSWR(`/activity/list`, async (url: string) => {
    const response = await axiosInstance.get(url, {
      params,
    });
    return response.data?.data as IResponseActivityList;
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// done
// https://api-test.buymore.fun/usurper/my-order/list?input_mint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&address=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
export function useMyOrderList(params: { inputMint: string; address: string }) {
  const { data, error, isLoading, mutate } = useSWR(`/my-order/list`, async (url: string) => {
    const response = await axiosInstance.get(url, {
      params,
    });
    return response.data.data as IResponseMyOrderList;
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// done
// https://api-test.buymore.fun/usurper/trade-history/list?input_mint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&address=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
export function useTradeHistoryList(params: { inputMint: string; address: string }) {
  const { data, error, isLoading, mutate } = useSWR(`/trade-history/list`, async (url: string) => {
    const response = await axiosInstance.get(url, {
      params,
    });
    return response.data.data as IResponseTradeHistoryList;
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// https://api-test.buymore.fun/usurper/community/detail?input_mint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
export function useCommunityDetail(params: { inputMint: string }) {
  const { data, error, isLoading, mutate } = useSWR(`/community/detail`, async (url: string) => {
    const response = await axiosInstance.get(url, {
      params,
    });
    return response.data?.data as IResponseCommunityDetail;
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// https://api-test.buymore.fun/usurper/orderbook/depth?input_mint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&output_mint=So11111111111111111111111111111111111111112&price=142.7
export function useOrderbookDepth(params: {
  inputMint: string;
  outputMint: string;
  price: number;
}) {
  const { data, error, isLoading, mutate } = useSWR(`/orderbook/depth`, async (url: string) => {
    const response = await axiosInstance.get(url, {
      params,
    });
    return response.data?.data as IResponseOrderbookDepth;
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// https://api-test.buymore.fun/usurper/pool/prepare-id?token=9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U&order_type=buy
export function usePoolPrepareId(params: { input_token: string; output_token: string }) {
  const { data, error, isLoading, mutate } = useSWR(
    `/pool/prepare-id`,
    async (url: string) => {
      const response = await axiosInstance.get(url, {
        params: {
          ...params,
        },
      });
      return response.data?.data as {
        pool_id: string;
      };
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshInterval: 0, // Disable polling
      dedupingInterval: 0, // Disable deduping
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// https://api-test.buymore.fun/usurper/cpmm-pool/fetch-all
// cache 10 minutes
export function useCpmmPoolFetchAll() {
  const { data, error, isLoading, mutate } = useSWR(
    `/cpmm-pool/fetch-all`,
    async (url: string) => {
      const response = await axiosInstance.get(url);
      return response.data?.data as IResponsePoolInfoItem[];
    },
    {
      dedupingInterval: 10 * 60 * 1000, // cache for 10 minutes
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// https://api-test.buymore.fun/usurper/cpmm-pool/fetch-one?pool_id=HDHtKXvFQBXeteQWPRDo8Q7LvPUXJ8XCLEhv6cCHQdcm
export function useCpmmPoolFetchOne(params: { pool_id: string }) {
  const { data, error, isLoading, mutate } = useSWR(`/cpmm-pool/fetch-one`, async (url: string) => {
    const response = await axiosInstance.get(url, { params });
    return response.data?.data as IResponsePoolInfoItem;
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
