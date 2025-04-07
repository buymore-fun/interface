"use client";

import { BN, Program, utils } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Cluster,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  Signer,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getHybirdTradeProgram, getHybirdTradeProgramId, getSeeds } from "@/anchor/src";
import { useAnchorProvider } from "@/app/solana-provider";
import { useTransactionToast } from "@/hooks/use-transaction-toast";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { OrderType } from "@/consts/order";
import {
  // TODO  default is TOKEN_PROGRAM_ID, add dynamic params
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
  getAccount,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  NATIVE_MINT,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { getPoolVaultAddress } from "@/hooks/hybird-trade/pda";
import { IResponsePoolInfoItem } from "@/types/response";
// http://localhost:3000/demo/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN
// http://localhost:3000/demo/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
// https://solscan.io/token/9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U?cluster=devnet#metadata

const raydium_cp_swap = `CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW`;

const USDC_MINT = new PublicKey("9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U");
// const tokenName = "USD Coin";
// 9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U

interface Trade {
  poolIndex: BN;
  orderId: BN;
}

export function useHybirdTradeProgram(mintAddress: string) {
  const wallet = useWallet();

  const { connection } = useConnection();
  // const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();

  const program = useMemo(() => getHybirdTradeProgram(provider), [provider]);

  const SEEDS = useMemo(() => getSeeds(program), [program]);

  // console.log( program.idl.constants)

  const getProgramAddress = () => {
    const [counter] = PublicKey.findProgramAddressSync(
      // [Buffer.from(`buymore_order_counter_${VERSION}`)],
      [SEEDS["ORDER_COUNTER_SEED"]],
      program.programId
    );

    const [order_config] = PublicKey.findProgramAddressSync(
      // [Buffer.from(`buymore_order_config_${VERSION}`)],
      [SEEDS["ORDER_CONFIG_SEED"]],
      program.programId
    );

    const [pool_authority] = PublicKey.findProgramAddressSync(
      // [ Buffer.from(`buymore_authority_${VERSION}`), USDC_MINT.toBytes() ],
      [SEEDS["AUTHORITY_SEED"], USDC_MINT.toBytes()],
      program.programId
    );

    const [sol_vault] = PublicKey.findProgramAddressSync(
      [SEEDS["SOL_VAULT_SEED"], USDC_MINT.toBytes()],
      program.programId
    );

    const [token_vault] = PublicKey.findProgramAddressSync(
      [pool_authority.toBytes(), TOKEN_PROGRAM_ID.toBytes(), USDC_MINT.toBytes()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const getOrderBookDetail = (cfg: IResponsePoolInfoItem) => {
      const token_0_mint = new PublicKey(cfg.cpmm.mintA);
      const token_1_mint = new PublicKey(cfg.cpmm.mintB);

      const [order_book_detail] = PublicKey.findProgramAddressSync(
        [Buffer.from("buymore_order_detail_v1"), token_0_mint.toBytes(), token_1_mint.toBytes()],
        program.programId
      );

      return order_book_detail;
    };

    return { counter, order_config, pool_authority, sol_vault, token_vault, getOrderBookDetail };
  };

  const getPayerATA = () => {
    const [payer_ata] = PublicKey.findProgramAddressSync(
      [wallet.publicKey!.toBytes(), TOKEN_PROGRAM_ID.toBytes(), USDC_MINT.toBytes()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    return { payer_ata };
  };

  const solToWsol = async (amount: number) => {
    const tx = new Transaction();

    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey!);

    const associatedTokenAccountInfo =
      await program.provider.connection.getAccountInfo(associatedTokenAccount);

    if (!associatedTokenAccountInfo) {
      console.log(
        "Warning: WSOL ATA not found, will attempt to create. If this is not the first conversion, please check previous operations."
      );

      tx.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey!,
          associatedTokenAccount,
          wallet.publicKey!,
          NATIVE_MINT
        )
      );
    }

    tx.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: associatedTokenAccount,
        lamports: amount,
      }),
      createSyncNativeInstruction(associatedTokenAccount)
    );

    const signature = await provider.sendAndConfirm(tx);
    // console.log("Your transaction signature", signature);
    transactionToast(signature);
    // throw signature;
    return tx;
  };

  const cancelOrder = async (poolId: number, orderType: number, orderId: number) => {
    // const { token_vault } = getProgramAddress();
    // const { payer_ata } = getPayerATA();
    // const pool_id = new BN(1);
    // const order_type = OrderType.Sell;
    // const cancel_order_id = new BN(3);
    // const tx = new Transaction();
    // const ix = await program.methods
    //   .cancelOrder(pool_id, order_type, cancel_order_id)
    //   .accounts({
    //     payer: wallet.publicKey!,
    //     tokenVault: token_vault,
    //     to: wallet.publicKey!,
    //     toAta: payer_ata,
    //     tokenMint: USDC_MINT,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //   })
    //   .instruction();
    // tx.add(ix);
    // const signature = await provider.sendAndConfirm(tx);
    // console.log("Your transaction signature", signature);
    // transactionToast(signature);
    // return signature;
  };

  async function trade_in_v1(
    in_amount: BN,
    out_amount: BN,
    cfg: IResponsePoolInfoItem,
    trades: Trade[]
  ) {
    const { getOrderBookDetail } = getProgramAddress();

    const token_0_mint = new PublicKey(cfg.cpmm.mintA);
    const token_1_mint = new PublicKey(cfg.cpmm.mintB);

    const token_0_program = new PublicKey(cfg.cpmm.mintProgramA);
    const token_1_program = new PublicKey(cfg.cpmm.mintProgramB);

    const token_0_vault = new PublicKey(cfg.cpmm.vaultA);
    const token_1_vault = new PublicKey(cfg.cpmm.vaultB);

    const [order_book_authority] = make_pool_authority(token_0_mint, token_1_mint);

    const token_0_pool_vault = getAssociatedTokenAddressSync(
      token_0_mint,
      order_book_authority,
      true,
      token_0_program
    );

    const token_1_pool_vault = getAssociatedTokenAddressSync(
      token_1_mint,
      order_book_authority,
      true,
      token_1_program
    );

    const input_token_account = getAssociatedTokenAddressSync(
      token_0_mint,
      wallet.publicKey!,
      false,
      token_0_program
    );

    const output_token_account = getAssociatedTokenAddressSync(
      token_1_mint,
      wallet.publicKey!,
      false,
      token_1_program
    );

    const settle_id = new BN(Date.now());
    // const settle_id = new BN(0)
    // const settle_id = Date.now() + ''
    const raydium_pubkey = new PublicKey(raydium_cp_swap);
    const POOL_AUTH_SEED = Buffer.from(utils.bytes.utf8.encode("vault_and_lp_mint_auth_seed"));
    const POOL_SEED = Buffer.from(utils.bytes.utf8.encode("pool"));
    const ORACLE_SEED = Buffer.from(utils.bytes.utf8.encode("observation"));

    const [POOL_AUTH_PUBKEY, POOL_AUTH_BUMP] = PublicKey.findProgramAddressSync(
      [POOL_AUTH_SEED],
      raydium_pubkey
    );
    const pool_state = new PublicKey(cfg.cpmm.poolId);
    const ammConfig = new PublicKey(cfg.cpmm.configId);
    const swap_input_vault = new PublicKey(cfg.cpmm.vaultA);
    const swap_output_vault = new PublicKey(cfg.cpmm.vaultB);
    const swap_observation = new PublicKey(cfg.cpmm.observationId);

    const order_book_detail = getOrderBookDetail(cfg);

    /**
     *   "Program log: Left:",
  "Program log: 9mh6ZAYvsjHBvirTvhmAn3n2rBob9KdJEq9BDC46cLaL",
  "Program log: Right:",
  "Program log: J1ZMFdUfSTUGYrnRNcNF3uTnYfLu1KGzWyPzpNgT15j5",
     */
    // console.log( settle_id.toArrayLike(Buffer, 'le', 8), token_0_mint.toBase58(), token_1_mint.toBase58() )

    const [settle_pool] = PublicKey.findProgramAddressSync(
      [
        // Buffer.from("buymore_settle_pool_v1"),
        SEEDS["SETTLE_POOL_SEED"],
        settle_id.toArrayLike(Buffer, "le", 8),
        // Buffer.from(settle_id),
        // Buffer.from([255,255,255,255,255,255,255,255]),
        token_0_mint.toBytes(),
        token_1_mint.toBytes(),
      ],
      program.programId
    );

    //DUhdg6GumNwU1miBRTdf11WqvzuQhxoc98qkDrJHZaCD
    console.log(`settle pool: `, settle_pool.toBase58());

    const order_book_0 = order_book(order_book_detail, new BN(1), token_0_mint, token_1_mint);

    const tx = new Transaction();

    console.group("trade_in_v1");
    console.log("order_book_authority", order_book_authority.toBase58());
    console.log("token_0_pool_vault", token_0_pool_vault.toBase58());
    console.log("token_1_pool_vault", token_1_pool_vault.toBase58());
    console.log("settle_id", settle_id.toString());
    console.log("in_amount", in_amount.toString());
    console.log("out_amount", out_amount.toString());
    console.log(
      "trades",
      trades.map((t) => `poolIndex: ${t.poolIndex.toString()} orderId: ${t.orderId.toString()}`)
    );
    console.groupEnd();

    const ix = await program.methods
      .proxySwapBaseInput(settle_id, in_amount, out_amount, trades)
      .accounts({
        cpSwapProgram: raydium_pubkey,
        payer: wallet.publicKey!,
        authority: POOL_AUTH_PUBKEY,
        ammConfig,
        poolState: pool_state,
        inputTokenAccount: input_token_account,
        outputTokenAccount: output_token_account,
        inputVault: swap_input_vault,
        outputVault: swap_output_vault,
        inputTokenProgram: token_0_program,
        outputTokenProgram: token_1_program,
        inputTokenMint: token_0_mint,
        outputTokenMint: token_1_mint,
        observationState: swap_observation,
        // buymore
        orderBook0: order_book_0,
        orderBook1: order_book_0, //not use
        orderBookInputVault: token_0_pool_vault,
        orderBookOutputVault: token_1_pool_vault,
        orderBookDetail: order_book_detail,
        orderBookAuthority: order_book_authority,
        settlePool: settle_pool,
      })
      .instruction();

    tx.add(ix);

    const sig1 = await provider.sendAndConfirm(tx);
    transactionToast(sig1);
    console.log("Your transaction signature", sig1);
  }

  const make_pool_authority = (token_0_mint: PublicKey, token_1_mint: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [SEEDS["AUTHORITY_SEED"], token_0_mint.toBytes(), token_1_mint.toBytes()],
      program.programId
    );
  };

  const order_book = (
    order_book_detail: PublicKey,
    pool_id: BN,
    input_token_mint: PublicKey,
    output_token_mint: PublicKey
  ) => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("buymore_order_with_token_v1"),
        order_book_detail.toBytes(),
        new Uint8Array(pool_id.toArray("le", 8)),
        input_token_mint.toBytes(),
        output_token_mint.toBytes(),
      ],
      program.programId
    )[0];
  };

  async function initialize_pool(poolId: number, cfg: IResponsePoolInfoItem) {
    const { getOrderBookDetail } = getProgramAddress();
    const { order_config } = getProgramAddress();
    console.log(`Initialize pool (${cfg.cpmm.mintA} <-> ${cfg.cpmm.mintB}) `);

    const pool_state = new PublicKey(cfg.cpmm.poolId);
    const token_0_mint = new PublicKey(cfg.cpmm.mintA);
    const token_1_mint = new PublicKey(cfg.cpmm.mintB);

    const token_0_program = new PublicKey(cfg.cpmm.mintProgramA);
    const token_1_program = new PublicKey(cfg.cpmm.mintProgramB);

    const [initialize_pool_authority] = make_pool_authority(token_0_mint, token_1_mint);

    const token_0_vault = getAssociatedTokenAddressSync(
      token_0_mint,
      initialize_pool_authority,
      true,
      token_0_program,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const token_1_vault = getAssociatedTokenAddressSync(
      token_1_mint,
      initialize_pool_authority,
      true,
      token_1_program,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const token_0_account = await program.provider.connection.getAccountInfo(token_0_mint);
    const token_1_account = await program.provider.connection.getAccountInfo(token_1_mint);

    if (token_0_account && token_1_account) {
      console.log("Pool already initialized");
      return;
    }

    const order_book_detail = getOrderBookDetail(cfg);

    const tx = new Transaction();

    const ix = await program.methods
      .initializePool(new BN(poolId))
      .accounts({
        payer: wallet.publicKey!,
        token0Mint: token_0_mint,
        token1Mint: token_1_mint,
        token0Vault: token_0_vault,
        token1Vault: token_1_vault,
        poolState: pool_state,
        poolAuthority: initialize_pool_authority,
        orderBookDetail: order_book_detail,
        config: order_config,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const sig = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", sig);
  }

  async function add_order_v2(
    input_token_mint: PublicKey,
    in_amount: BN,
    min_out_amount: BN,
    pool_id: BN,
    cfg: IResponsePoolInfoItem
  ) {
    const { counter, getOrderBookDetail } = getProgramAddress();
    const order_book_detail = getOrderBookDetail(cfg);
    const tx = new Transaction();

    const token_0_mint = new PublicKey(cfg.cpmm.mintA);
    const token_1_mint = new PublicKey(cfg.cpmm.mintB);

    const token_0_program = new PublicKey(cfg.cpmm.mintProgramA);
    const token_1_program = new PublicKey(cfg.cpmm.mintProgramB);

    const input_token_program =
      input_token_mint.toBase58() === token_0_mint.toBase58() ? token_0_program : token_1_program;

    const input_token_ata = getAssociatedTokenAddressSync(
      input_token_mint,
      wallet.publicKey!,
      false,
      input_token_program
    );

    const output_token_mint =
      input_token_mint.toBase58() === token_0_mint.toBase58() ? token_1_mint : token_0_mint;

    const [pool_authority] = make_pool_authority(token_0_mint, token_1_mint);

    const input_token_vault = getAssociatedTokenAddressSync(
      input_token_mint,
      pool_authority,
      true,
      input_token_program
    );
    const orderBook = order_book(order_book_detail, pool_id, input_token_mint, output_token_mint);

    const now = Math.floor(Date.now() / 1000) + 60 * 60 * 365; // 1day

    const now_v = new BN(now);

    const ix = await program.methods
      .addOrderToPool(pool_id, in_amount, min_out_amount, now_v)
      .accounts({
        payer: wallet.publicKey!,
        inputTokenMint: input_token_mint,
        outputTokenMint: output_token_mint,
        orderBookDetail: order_book_detail,
        orderBook: orderBook,
        inputTokenAta: input_token_ata,
        inputTokenVault: input_token_vault,
        poolAuthority: pool_authority,
        counter,
        tokenProgram: input_token_program,
      })
      .instruction();

    tx.add(ix);

    console.group("add_order_v2");
    console.log("input_token_mint:", input_token_mint.toBase58());
    console.log("pool_id:", pool_id.toString());
    console.log("in_amount:", in_amount.toString());
    console.log("min_out_amount:", min_out_amount.toString());
    console.log("now_v:", now_v.toString());
    console.log("wallet.publicKey!:", wallet.publicKey!.toBase58());
    console.log("token_0_mint:", token_0_mint.toBase58());
    console.log("token_1_mint:", token_1_mint.toBase58());
    console.log("order_book_detail:", order_book_detail.toBase58());
    console.log("orderBook:", orderBook.toBase58());
    console.log("input_token_ata:", input_token_ata.toBase58());
    console.log("input_token_vault:", input_token_vault.toBase58());
    console.log("pool_authority:", pool_authority.toBase58());
    console.log("counter:", counter.toBase58());
    console.log("input_token_program:", input_token_program.toBase58());
    console.groupEnd();

    const sig1 = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", sig1);
    transactionToast(sig1);
    console.log(`Generate Buy Order ID: 1 , pool_id: ${pool_id} in_amount: ${in_amount}, `);
  }

  return {
    add_order_v2,
    initialize_pool,
    program,
    cancelOrder,
    trade_in_v1,
    solToWsol,
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
