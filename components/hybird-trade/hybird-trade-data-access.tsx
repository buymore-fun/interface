"use client";

import { BN, Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getHybirdTradeProgram, getHybirdTradeProgramId, getSeeds } from "@/anchor/src";
import { useAnchorProvider } from "@/app/solana-provider";
import { useTransactionToast } from "@/hooks/use-transaction-toast";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ORDER_COUNTER_SEED,
  ORDER_CONFIG_SEED,
  AUTHORITY_SEED,
  ORDER_BOOK_DETAIL_SEED,
  ORDER_BOOK_WITH_TOKEN_SEED,
  OrderType,
} from "@/anchor/constants";
import {
  TOKEN_PROGRAM_ID as TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// http://localhost:3000/demo/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN
// http://localhost:3000/demo/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
// https://solscan.io/token/9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U?cluster=devnet#metadata

const USDC_MINT = new PublicKey("9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U");
const tokenName = "USD Coin";
// 9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U

export function useHybirdTradeProgram() {
  const wallet = useWallet();

  const { connection } = useConnection();
  // const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  // console.log("🚀 ~ useHybirdTradeProgram ~ provider:", provider.wallet.publicKey?.toBase58());
  // log provider cluster
  // console.log("🚀 ~ useHybirdTradeProgram ~ provider:", provider.connection.rpcEndpoint);

  const program = useMemo(() => getHybirdTradeProgram(provider), [provider]);

  const SEEDS = useMemo(() => getSeeds(program), [program]);

  // console.log( program.idl.constants)

  const [counter] = PublicKey.findProgramAddressSync(
    // [Buffer.from(`buymore_order_counter_${VERSION}`)],
    [SEEDS["orderCounterSeed"]],
    program.programId
  );
  // console.log("🚀 ~ useHybirdTradeProgram ~ counter:", counter.toBase58());

  const [order_config] = PublicKey.findProgramAddressSync(
    // [Buffer.from(`buymore_order_config_${VERSION}`)],
    [SEEDS["orderConfigSeed"]],
    program.programId
  );

  const [pool_authority] = PublicKey.findProgramAddressSync(
    // [ Buffer.from(`buymore_authority_${VERSION}`), USDC_MINT.toBytes() ],
    [SEEDS["authoritySeed"], USDC_MINT.toBytes()],
    program.programId
  );

  // const [ order_book_detail ] = PublicKey.findProgramAddressSync(
  //     // [ Buffer.from(`buymore_order_detail_${VERSION}`), USDC_MINT.toBytes()],
  //     [ SEEDS['orderDetailSeed'], USDC_MINT.toBytes()],
  //     program.programId
  // )

  const [sol_vault] = PublicKey.findProgramAddressSync(
    [SEEDS["solVaultSeed"], USDC_MINT.toBytes()],
    program.programId
  );

  const [token_vault] = PublicKey.findProgramAddressSync(
    [pool_authority.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), USDC_MINT.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  console.log(`token_vault`, token_vault.toBase58());

  // TODO TOKEN_2022_PROGRAM_ID dynamic
  const [payer_ata] = PublicKey.findProgramAddressSync(
    [wallet.publicKey!.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), USDC_MINT.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  console.log(`payer_ata`, payer_ata.toBase58());

  // const fetchPoolData = async () => {
  //   // const orderbook_data = await program.account.orderBook.fetch(mint);

  //   // return orderbook_data;

  //   const order_book_detail_data = await program.account.orderBookDetail.fetch(order_book_detail);
  //   console.log("🚀 ~ fetchPoolData ~ order_book_detail_data:", order_book_detail_data);

  //   return order_book_detail_data;
  // };

  // const initializeBuymoreProgram = async () => {
  //   const tx = new Transaction();

  //   const orderCounter = await program.account.orderCounter.fetch(counter);
  //   // console.log("🚀 ~ initializeBuymoreProgram ~ orderCounter:", orderCounter.value);
  //   const r = orderCounter.value.toNumber();

  //   // console.log("🚀 ~ initializeBuymoreProgram ~ wallet.publicKey:", wallet.publicKey?.toBase58());
  //   const ix = await program.methods
  //     .initialize(wallet.publicKey!)
  //     .accounts({
  //       payer: wallet.publicKey!,
  //     })
  //     .instruction();

  //   tx.add(ix);

  //   const signature = await provider.sendAndConfirm(tx);
  //   console.log("Your transaction signature", signature);
  //   return signature;
  // };

  const initializePool = async (amount: number) => {
    const tx = new Transaction();

    const ix = await program.methods
      .initializePool(new BN(amount))
      .accounts({
        payer: wallet.publicKey!,
        tokenMint: USDC_MINT,
        config: order_config,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    // const signature = await wallet.sendTransaction(tx, connection);
    const signature = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", signature);
    transactionToast(signature);
    return signature;
  };

  const send_and_config = async (tx, payer) => {
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer[0].publicKey;

    const sig = await connection.sendTransaction(tx, payer);
    await connection.confirmTransaction(
      {
        signature: sig,
        blockhash: blockhash,
        lastValidBlockHeight: (await connection.getBlockHeight()) + 250,
      },
      "confirmed"
    );

    return sig;
  };

  const addOrder = async (
    in_amount: BN,
    out_amount: BN,
    order_type: number,
    pool_id: BN,
    expiryTime?: number
  ) => {
    const now = expiryTime || Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1day by default

    in_amount = new BN(10000);
    out_amount = new BN(1000);
    order_type = OrderType.Buy;
    pool_id = new BN(1);

    const now_v = new BN(now);

    const tx = new Transaction();

    const ix = await program.methods
      .addOrderToPool(pool_id, order_type, in_amount, out_amount, now_v)
      .accounts({
        payer: wallet.publicKey!,
        tokenVault: token_vault,
        fromAta: payer_ata,
        mint: USDC_MINT,
        counter: counter,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const signature = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", signature);
    transactionToast(signature);
    return signature;
  };

  // const addTokenOrder = async (amount: number, price: number, expiryTime?: number) => {
  //   const now = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1day
  //   const in_amount = new BN(1000);
  //   const out_amount = new BN(10000);
  //   const now_v = new BN(now);
  //   const order_type = OrderType.Sell;
  //   const pool_id = new BN(2); // different pool id for different orderbook pool.

  //   const tx = new Transaction();

  //   const ix = await program.methods
  //     .addOrderToPool(
  //       pool_id,
  //       order_type, // sell
  //       in_amount,
  //       out_amount,
  //       now_v
  //     )
  //     .accounts({
  //       payer: wallet.publicKey!,
  //       orderBook: order_book(wallet.publicKey, pool_id, order_type),
  //       tokenVault: pool_account,
  //       fromAta: payerATA,
  //       mint: mint,
  //       counter: counter,
  //       tokenProgram: TOKEN_2022_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //     })
  //     .instruction();

  //   tx.add(ix);

  //   const signature = await provider.sendAndConfirm(tx);
  //   console.log("Your transaction signature", signature);
  //   transactionToast(signature);
  //   return signature;
  // };

  const cancelOrder = async (poolId: number, orderType: number, orderId: number) => {
    const pool_id = new BN(1);
    const order_type = OrderType.Sell;
    const cancel_order_id = new BN(3);

    const tx = new Transaction();

    const ix = await program.methods
      .cancelOrder(pool_id, order_type, cancel_order_id)
      .accounts({
        payer: wallet.publicKey!,
        tokenVault: token_vault,
        to: wallet.publicKey!,
        toAta: payer_ata,
        tokenMint: USDC_MINT,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const signature = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", signature);
    transactionToast(signature);
    return signature;
  };

  return {
    program,
    // fetchPoolData,
    initializePool,
    addOrder,
    cancelOrder,
  };
}

// export function useCounterProgramAccount({ account }: { account: PublicKey }) {
//   const { cluster } = useCluster();
//   const transactionToast = useTransactionToast();
//   const { program, accounts } = useCounterProgram();

//   const accountQuery = useQuery({
//     queryKey: ["counter", "fetch", { cluster, account }],
//     queryFn: () => program.account.counter.fetch(account),
//   });

//   const decrementMutation = useMutation({
//     mutationKey: ["counter", "decrement", { cluster, account }],
//     mutationFn: () => program.methods.decrement().accounts({ counter: account }).rpc(),
//     onSuccess: (tx) => {
//       transactionToast(tx);
//       return accountQuery.refetch();
//     },
//   });

//   const incrementMutation = useMutation({
//     mutationKey: ["counter", "increment", { cluster, account }],
//     mutationFn: () => program.methods.increment().accounts({ counter: account }).rpc(),
//     onSuccess: (tx) => {
//       transactionToast(tx);
//       return accountQuery.refetch();
//     },
//   });

//   return {
//     accountQuery,
//     decrementMutation,
//     incrementMutation,
//   };
// }
