import { ApiV3PoolInfoStandardItemCpmm, CpmmKeys, CpmmRpcData } from "@raydium-io/raydium-sdk-v2";

export type CpmmPoolInfo = {
  poolInfo: ApiV3PoolInfoStandardItemCpmm;
  poolKeys: CpmmKeys;
  rpcData: CpmmRpcData;
};
