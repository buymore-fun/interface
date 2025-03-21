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
    enable: boolean;
    logo: string;
    url: string;
    order?: number;
  }[];
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

export interface IResponseActivityList {
  items: IActivityItem[];
  page_no: number;
  total_page: number;
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
export interface IResponseTradeHistory {
  items: ITradeHistoryItem[];
  page_no: number;
  total_page: number;
}

interface ITradeHistoryItem {
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

interface IOrderbookDepthItem {
  amount: string;
  price: string;
  total: string;
  type: "sell" | "buy";
}

export interface IResponseOrderbookDepth {
  items: IOrderbookDepthItem[];
  page_no: number;
  total_page: number;
}
