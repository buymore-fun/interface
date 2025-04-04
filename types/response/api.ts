import { IResponseCommonList } from "./common";

export interface IResponseDashboardIndex {
  orders: string;
  total_volume: string;
  traders: string;
  value_of_buymore: string;
}

export interface IResponseCommunityDetail {
  active_fund: {
    url: string;
    value: string;
  };
  active_mbrs_24h: {
    url: string;
    value: string;
  };
  announcement: {
    items: {
      content: string;
      time: number;
    }[];
    url: string;
  };
  community_mbrs: {
    url: string;
    value: string;
  };
  contact: {
    dex: {
      enable: boolean;
      logo: string;
      order: number;
      url: string;
    };
    tg: {
      enable: boolean;
      logo: string;
      order: number;
      url: string;
    };
    web: {
      enable: boolean;
      logo: string;
      order: number;
      url: string;
    };
    x: {
      enable: boolean;
      logo: string;
      order: number;
      url: string;
    };
  };
  holders: {
    url: string;
    value: string;
  };
}

export interface IResponseOrderBook {
  asks: IOrder[];
  bids: IOrder[];
}

interface IOrder {
  input_amount: string;
  order_id: string;
  outnput_amount: string;
  price: string;
  side: "SELL" | "BUY";
}

export interface IResponseActivityList extends IResponseCommonList<IActivityItem> {
  query?: {
    input_mint: string;
  };
}

interface IActivityItem {
  amount: string;
  buymore: {
    address: string;
    amount: string;
    coin_name: string;
    symbol: string;
  };
  marker: string;
  routing: {
    dec: number;
    order: number;
  };
  time: number;
  tx: string;
  type: "sell" | "buy";
  usd: string;
}

interface ITradeHistoryItem {
  amount: {
    buy: string;
    coin_name: string;
    sell: string;
    symbol: string;
  };
  buymore: {
    address: string;
    amount: string;
    coin_name: string;
    symbol: string;
  };
  marker: string;
  routing: {
    dec: number;
    order: number;
  };
  time: number;
  tx: string;
  type: "sell" | "buy";
  usd: string;
  from: string;
  receive: {
    amount: string;
    coin_name: string;
    symbol: string;
  };
}

export interface IResponseTradeHistoryList extends IResponseCommonList<ITradeHistoryItem> {
  query?: {
    input_mint: string;
    address: string;
  };
}

interface IOrderbookDepthItem {
  amount: string;
  price: string;
  total: string;
  type: "sell" | "buy";
}

export interface IResponseOrderbookDepth extends IResponseCommonList<IOrderbookDepthItem> {
  query?: {
    input_mint: string;
  };
}

interface IMyOrderItem {
  amount: {
    buy: string;
    coin_name: string;
    sell: string;
    symbol: string;
  };
  price: string;
  receive: {
    amount: string;
    coin_name: string;
    symbol: string;
  };
  time: number;
  tx: string;
  type: "sell" | "buy";
  usd: string;
  id?: string;
  symbol?: string;
}

export interface IResponseMyOrderList extends IResponseCommonList<IMyOrderItem> {
  query?: {
    input_mint: string;
    address: string;
  };
}

export interface IResponsePoolInfoItem {
  buymore: {
    pool_pubkey: string;
    token_0_mint: string;
    token_1_mint: string;
    token_0_vault: string;
    token_1_vault: string;
    order_book_detail: string;
    max: number;
    sys_receiver: string;
    com_receiver: string;
    fee_rate: number;
  };
  cpmm: {
    poolId: string;
    mintA: string;
    mintB: string;
    vaultA: string;
    vaultB: string;
    observationId: string;
    mintLp: string;
    configId: string;
    poolCreator: string;
    mintProgramA: string;
    mintProgramB: string;
    bump: number;
    status: number;
    lpDecimals: number;
    mintDecimalA: number;
    mintDecimalB: number;
    openTime: string;
    lpAmount: string;
    protocolFeesMintA: string;
    protocolFeesMintB: string;
    fundFeesMintA: string;
    fundFeesMintB: string;
  };
}
