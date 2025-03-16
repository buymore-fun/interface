"use client";

import { BN, Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getHybirdTradeProgram, getHybirdTradeProgramId } from "@/anchor/src";
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
import { TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

// http://localhost:3000/demo/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN
// http://localhost:3000/demo/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
// https://solscan.io/token/9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U?cluster=devnet#metadata

export function useHybirdTradeProgram() {
  const wallet = useWallet();

  const { connection } = useConnection();
  // const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();

  const program = useMemo(() => getHybirdTradeProgram(provider), [provider]);

  const usdcMintAddress = new PublicKey("9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U");
  const tokenName = "USD Coin";

  // const [mint] = PublicKey.findProgramAddressSync(
  //   [Buffer.from("token-2022-token"), wallet!.publicKey!.toBytes(), Buffer.from(tokenName)],
  //   // MINT ADDRESS
  //   usdcMintAddress
  // );

  // const [program_mint] = PublicKey.findProgramAddressSync(
  //   [Buffer.from("token-2022-token"), program.programId.toBytes(), Buffer.from(tokenName)],
  //   program.programId
  // );

  const mint = usdcMintAddress;

  // const mintAddress = mint.toBase58();

  const [payerATA] = PublicKey.findProgramAddressSync(
    [wallet.publicKey!.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const receiver = Keypair.generate();

  const [receiverATA] = PublicKey.findProgramAddressSync(
    [receiver.publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mint.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  // console.log("🚀 ~ useHybirdTradeProgram ~ receiverATA:", receiverATA.toBase58());

  const [counter] = PublicKey.findProgramAddressSync(
    [Buffer.from(ORDER_COUNTER_SEED)],
    program.programId
  );
  // console.log("🚀 ~ useHybirdTradeProgram ~ counter:", counter.toBase58());

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
  console.log("🚀 ~ useHybirdTradeProgram ~ order_book_detail:", order_book_detail.toBase58());

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
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // console.log("🚀 ~ mintAddress ~ address:", mintAddress);

  const fetchPoolData = async () => {
    // const orderbook_data = await program.account.orderBook.fetch(mint);

    // return orderbook_data;

    const order_book_detail_data = await program.account.orderBookDetail.fetch(order_book_detail);
    console.log("🚀 ~ fetchPoolData ~ order_book_detail_data:", order_book_detail_data);

    return order_book_detail_data;
  };

  const initializeBuymoreProgram = async () => {
    const tx = new Transaction();

    const orderCounter = await program.account.orderCounter.fetch(counter);
    // console.log("🚀 ~ initializeBuymoreProgram ~ orderCounter:", orderCounter.value);
    const r = orderCounter.value.toNumber();

    // console.log("🚀 ~ initializeBuymoreProgram ~ wallet.publicKey:", wallet.publicKey?.toBase58());
    const ix = await program.methods
      .initialize(wallet.publicKey!)
      .accounts({
        payer: wallet.publicKey!,
      })
      .instruction();

    tx.add(ix);

    const signature = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", signature);
    return signature;
  };

  const initializePool = async (amount: number) => {
    const tx = new Transaction();

    const ix = await program.methods
      .initializePool(new BN(amount))
      .accounts({
        payer: wallet.publicKey!,
        tokenMint: mint,
        // tokenMint: program_mint,
        tokenVault: pool_account,
        config: order_config,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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
    fetchPoolData,
    initializePool,
    addSOLOrder,
    addTokenOrder,
    cancelOrder,
    initializeBuymoreProgram,
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
