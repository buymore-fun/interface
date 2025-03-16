"use client";

import { BN, Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  ATA_PROGRAM_ID,
  getHybirdTradeProgram,
  getHybirdTradeProgramId,
  TOKEN_2022_PROGRAM_ID,
} from "@/anchor/src";
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

// http://localhost:3000/demo/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN
// http://localhost:3000/demo/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

export function useHybirdTradeProgram() {
  const wallet = useWallet();

  const { connection } = useConnection();
  // const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();

  const program = useMemo(() => getHybirdTradeProgram(provider), [provider]);

  const [mint] = PublicKey.findProgramAddressSync(
    [Buffer.from("token-2022-token"), wallet!.publicKey!.toBytes(), Buffer.from("USDC")],
    program.programId
  );

  const [payerATA] = PublicKey.findProgramAddressSync(
    [wallet.publicKey!.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
    ATA_PROGRAM_ID
  );

  const receiver = Keypair.generate();

  const [receiverATA] = PublicKey.findProgramAddressSync(
    [receiver.publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
    ATA_PROGRAM_ID
  );
  console.log("🚀 ~ useHybirdTradeProgram ~ receiverATA:", receiverATA.toBase58());

  const [counter] = PublicKey.findProgramAddressSync(
    [Buffer.from(ORDER_COUNTER_SEED)],
    program.programId
  );

  const [order_config] = PublicKey.findProgramAddressSync(
    [Buffer.from(ORDER_CONFIG_SEED)],
    program.programId
  );

  const [contract_authority] = PublicKey.findProgramAddressSync(
    [Buffer.from(AUTHORITY_SEED), mint.toBytes()],
    program.programId
  );

  const [order_book_detail] = PublicKey.findProgramAddressSync(
    [Buffer.from(ORDER_BOOK_DETAIL_SEED), mint.toBytes()],
    program.programId
  );

  const order_book = (owner, pool_id, type_v) => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(ORDER_BOOK_WITH_TOKEN_SEED),
        new Uint8Array(pool_id.toArray("le", 8)),
        new Uint8Array([type_v]),
        // owner.toBytes(),
        mint.toBytes(),
      ],
      program.programId
    );
  };

  const [pool_account] = PublicKey.findProgramAddressSync(
    [contract_authority.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
    ATA_PROGRAM_ID
  );

  const initializePool = async (amount: number) => {
    const tx = new Transaction();

    const ix = await program.methods
      .initializePool(new BN(amount))
      .accounts({
        payer: wallet.publicKey!,
        tokenMint: mint,
        tokenVault: pool_account,
        config: order_config,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ATA_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const signature = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", signature);
    transactionToast(signature);
    return signature;
  };

  const addSOLOrder = async (amount: number, price: number, expiryTime?: number) => {
    const now = expiryTime || Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1day by default
    const in_amount = new BN(10000);
    const out_amount = new BN(1000);
    const now_v = new BN(now);
    const order_type = OrderType.Buy;
    const pool_id = new BN(1);

    const tx = new Transaction();

    const ix = await program.methods
      .addOrderToPool(pool_id, order_type, in_amount, out_amount, now_v)
      .accounts({
        payer: wallet.publicKey!,
        orderBook: order_book(wallet.publicKey, pool_id, order_type),
        tokenVault: pool_account,
        fromAta: payerATA, // For SOL orders, this should be null or handled differently
        mint: mint,
        counter: counter,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ATA_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const signature = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", signature);
    transactionToast(signature);
    return signature;
  };

  const addTokenOrder = async (amount: number, price: number, expiryTime?: number) => {
    const now = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1day
    const in_amount = new BN(1000);
    const out_amount = new BN(10000);
    const now_v = new BN(now);
    const order_type = OrderType.Sell;
    const pool_id = new BN(2); // different pool id for different orderbook pool.

    const tx = new Transaction();

    const ix = await program.methods
      .addOrderToPool(
        pool_id,
        order_type, // sell
        in_amount,
        out_amount,
        now_v
      )
      .accounts({
        payer: wallet.publicKey!,
        orderBook: order_book(wallet.publicKey, pool_id, order_type),
        tokenVault: pool_account,
        fromAta: payerATA,
        mint: mint,
        counter: counter,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ATA_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const signature = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", signature);
    transactionToast(signature);
    return signature;
  };

  const cancelOrder = async (orderType: number, orderId: number) => {
    const pool_id = new BN(2);
    const order_type = OrderType.Sell;
    const cancel_order_id = new BN(3);

    const tx = new Transaction();

    const ix = await program.methods
      .cancelOrder(pool_id, order_type, cancel_order_id)
      .accounts({
        payer: wallet.publicKey!,
        orderBook: order_book(wallet.publicKey, pool_id, order_type),
        tokenVault: pool_account,
        tokenMint: mint,
        to: wallet.publicKey!,
        toAta: payerATA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ATA_PROGRAM_ID,
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
    initializePool,
    addSOLOrder,
    addTokenOrder,
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
