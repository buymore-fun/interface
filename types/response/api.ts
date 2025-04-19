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
    output_mint: string;
  };
}

interface IActivityItem {
  time: number;
  from_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  to_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  routing: {
    dec: number;
    order: number;
  };
  buymore_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  marker: string;
  tx: string;
}

interface ITradeHistoryItem {
  time: number;
  from_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  to_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  routing: {
    dec: number;
    order: number;
  };
  buymore_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  marker: string;
  tx: string;
}

export interface IResponseTradeHistoryList extends IResponseCommonList<ITradeHistoryItem> {
  query?: {
    input_mint: string;
    address: string;
  };
}

export interface IOrderbookDepthItem {
  order_id: number;
  pool_id: number;
  pool_pubkey: string;
  owner: string;
  input_token: string;
  in_amount: string;
  output_token: string;
  out_amount: string;
  price: string;
  deadline: number;
  tx_sign: string;
  block_time: number;
}

// export interface IResponseOrderbookDepth extends IResponseCommonList<IOrderbookDepthItem> {
//   query?: {
//     input_mint: string;
//   };
// }

export interface IMyOrderItem {
  time: number;
  from_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  to_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  receive_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  price: string;
  tx: string;
  order_id: number;
  pool_pubkey: string;
  pool_id: number;
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
