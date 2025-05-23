import { ApiV3PoolInfoStandardItem, AmmV4Keys, AmmRpcData } from "@raydium-io/raydium-sdk-v2";
import { txVersion } from "./config";
import BN from "bn.js";
import { isValidAmm } from "./utils";
import Decimal from "decimal.js";
import { NATIVE_MINT } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

export const swap = async () => {
  // const raydium = raydiumInstance!;
  const raydium: any = {};

  const amountIn = 1 * LAMPORTS_PER_SOL;
  const inputMint = NATIVE_MINT.toBase58();
  // const poolId = '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2' // SOL-USDC pool
  const poolId = "26auA3dMfiqK8SWBCkzShhkaSTbbWYQ3jrwhBQZCW5gT"; // SOL-USDC pool

  let poolInfo: ApiV3PoolInfoStandardItem;
  let poolKeys: AmmV4Keys | undefined;
  let rpcData: AmmRpcData;

  if (raydium.cluster === "mainnet") {
    // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
    // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
    const data = await raydium.api.fetchPoolById({ ids: poolId });
    poolInfo = data[0] as ApiV3PoolInfoStandardItem;
    if (!isValidAmm(poolInfo.programId)) throw new Error("target pool is not AMM pool");
    poolKeys = await raydium.liquidity.getAmmPoolKeys(poolId);
    rpcData = await raydium.liquidity.getRpcPoolInfo(poolId);
  } else {
    // note: getPoolInfoFromRpc method only return required pool data for computing not all detail pool info
    const data = await raydium.liquidity.getPoolInfoFromRpc({ poolId });
    poolInfo = data.poolInfo;
    // console.log("🚀 ~ swap ~ poolInfo:", poolInfo);
    poolKeys = data.poolKeys;
    rpcData = data.poolRpcData;
  }
  const [baseReserve, quoteReserve, status] = [
    rpcData.baseReserve,
    rpcData.quoteReserve,
    rpcData.status.toNumber(),
  ];

  if (poolInfo.mintA.address !== inputMint && poolInfo.mintB.address !== inputMint)
    throw new Error("input mint does not match pool");

  const baseIn = inputMint === poolInfo.mintA.address;
  const [mintIn, mintOut] = baseIn
    ? [poolInfo.mintA, poolInfo.mintB]
    : [poolInfo.mintB, poolInfo.mintA];

  const out = raydium.liquidity.computeAmountOut({
    poolInfo: {
      ...poolInfo,
      baseReserve,
      quoteReserve,
      status,
      version: 4,
    },
    amountIn: new BN(amountIn),
    mintIn: mintIn.address,
    mintOut: mintOut.address,
    slippage: 0.01, // range: 1 ~ 0.0001, means 100% ~ 0.01%
  });

  console.log(
    `computed swap ${new Decimal(amountIn)
      .div(10 ** mintIn.decimals)
      .toDecimalPlaces(mintIn.decimals)
      .toString()} ${mintIn.symbol || mintIn.address} \nto\n ${new Decimal(out.amountOut.toString())
      .div(10 ** mintOut.decimals)
      .toDecimalPlaces(mintOut.decimals)
      .toString()} ${mintOut.symbol || mintOut.address}, \nminimum amount out\n ${new Decimal(
      out.minAmountOut.toString()
    )
      .div(10 ** mintOut.decimals)
      .toDecimalPlaces(mintOut.decimals)} ${mintOut.symbol || mintOut.address}`
  );

  const { builder } = await raydium.liquidity.swap({
    // const result = await raydium.liquidity.swap({
    poolInfo,
    poolKeys,
    amountIn: new BN(amountIn),
    amountOut: out.minAmountOut, // out.amountOut means amount 'without' slippage
    fixedSide: "in",
    inputMint: mintIn.address,
    txVersion,

    // optional: set up token account
    // config: {
    //   inputUseSolBalance: true, // default: true, if you want to use existed wsol token account to pay token in, pass false
    //   outputUseSolBalance: true, // default: true, if you want to use existed wsol token account to receive token out, pass false
    //   associatedOnly: true, // default: true, if you want to use ata only, pass true
    // },

    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 46591500,
    // },

    // optional: add transfer sol to tip account instruction. e.g sent tip to jito
    // txTipConfig: {
    //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
    //   amount: new BN(10000000), // 0.01 sol
    // },
  });

  const transaction = new Transaction();

  const instructions: TransactionInstruction[] = builder.allInstructions;
  instructions.forEach((instruction) => {
    transaction.add(instruction);
  });

  return transaction;
};

/** uncomment code below to execute */
// swap();
