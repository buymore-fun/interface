import { OrderType } from "@/consts/order";
import {
  IResponseActivityList,
  IResponseCommunityDetail,
  IResponseDashboardIndex,
  IResponseMyOrderList,
  IResponseTradeHistoryList,
  IResponsePoolInfoItem,
  IOrderbookDepthItem,
} from "@/types";
import useSWR from "swr";
import { axiosInstance } from "@/lib/axios";
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
export function useActivityList(params: { input_token: string; output_token: string }) {
  const { data, error, isLoading, mutate } = useSWR(
    `/activity/list`,
    async (url: string) => {
      const response = await axiosInstance.get(url, {
        params,
      });
      return response.data?.data as IResponseActivityList;
    },
    {
      revalidateOnMount: false,
      refreshInterval: 3000,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// done
// https://api-test.buymore.fun/usurper/my-order/list?input_mint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&address=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
export function useMyOrderList(params: {
  input_token: string;
  output_token: string;
  address: string;
}) {
  const { data, error, isLoading, mutate } = useSWR(
    params.address ? `/my-order/list` : null,
    async (url: string) => {
      const response = await axiosInstance.get(url, {
        params,
      });
      console.log("SWR fetching my orders:", response.data.data);
      return response.data.data as IResponseMyOrderList;
    },
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      refreshInterval: 5000, // 更频繁地检查更新
      dedupingInterval: 1000, // 降低去重间隔，使得更容易触发重新获取
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// done
// https://api-test.buymore.fun/usurper/trade-history/list?input_mint=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&address=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
export function useTradeHistoryList(params: {
  input_token: string;
  output_token: string;
  address: string;
}) {
  const { data, error, isLoading, mutate } = useSWR(
    `/trade-history/list`,
    async (url: string) => {
      const response = await axiosInstance.get(url, {
        params,
      });
      return response.data.data as IResponseTradeHistoryList;
    },
    {
      revalidateOnMount: false,
      refreshInterval: 3000,
    }
  );

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

// https://api-test.buymore.fun/usurper/orderbook/depth?input_token=So11111111111111111111111111111111111111112&output_token=Ge7idPM1KBtu8Dzt5QsrWRxMNmv2KYSwzesXiCdkn84u&price=100000.000000000000000
export function useOrderbookDepth(params: {
  input_token?: string;
  output_token?: string;
  price?: number;
}) {
  const { data, error, isLoading, mutate } = useSWR(
    Object.values(params).every((value) => !value) ? `/orderbook/depth` : null,
    async (url: string) => {
      const response = await axiosInstance.get(url, {
        params,
      });
      return response.data?.data as IOrderbookDepthItem[];
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export async function getOrderbookDepth(params: {
  input_token: string;
  output_token: string;
  price: number;
}) {
  const { data } = await axiosInstance.get(`/orderbook/depth`, {
    params,
  });

  return data?.data as IOrderbookDepthItem[];
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
        pool_id: number;
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

// https://api-test.buymore.fun/usurper/cpmm-pool/fetch-one?mint_a=So11111111111111111111111111111111111111112&mint_b=H8RAUbA1PH8Gjaxj7awyf53TMrjBKNTQRQMM6TqGLQV8
export function useCpmmPoolFetchOne(params: { mint_a: string; mint_b: string }) {
  const { data, error, isLoading, mutate } = useSWR(
    params.mint_a && params.mint_b ? `/cpmm-pool/fetch-one` : null,
    async (url: string) => {
      const response = await axiosInstance.get(url, { params });
      return response.data?.data as IResponsePoolInfoItem;
    },
    {
      revalidateOnFocus: false,
      // revalidateOnMount: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5 * 60 * 1000, // cache for 5 minutes
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export async function getCpmmPoolFetchOne(params: { mint_a: string; mint_b: string }) {
  const { data } = await axiosInstance.get(`/cpmm-pool/fetch-one`, {
    params,
  });

  return data.data as IResponsePoolInfoItem;
}
