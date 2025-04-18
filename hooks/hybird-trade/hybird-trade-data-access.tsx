"use client";

import { BN, utils } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  Signer,
  Connection,
  TokenAmount,
} from "@solana/web3.js";
import { useMemo } from "react";

import { getHybirdTradeProgram, getSeeds } from "@/anchor/src";
import { useAnchorProvider } from "@/app/solana-provider";
import { useTransactionToast } from "@/hooks/use-transaction-toast";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  NATIVE_MINT,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { IOrderbookDepthItem, IResponsePoolInfoItem } from "@/types/response";
import { CpmmPoolInfo } from "@/types";
import Decimal from "decimal.js";
import config from "@/config";
import { ORDER_BOOK_DETAIL_SEED, ORDER_BOOK_WITH_TOKEN_SEED } from "@/anchor/constants";
// http://localhost:3000/demo/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN
// http://localhost:3000/demo/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
// https://solscan.io/token/9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U?cluster=devnet#metadata

const raydium_cp_swap = `CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW`;

// const USDC_MINT = new PublicKey("9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U");
// const tokenName = "USD Coin";
// 9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U

interface Trade {
  poolIndex: BN;
  orderId: BN;
}

export function useHybirdTradeProgram(mintAddress: string = "") {
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

    // const [pool_authority] = PublicKey.findProgramAddressSync(
    //   // [ Buffer.from(`buymore_authority_${VERSION}`), USDC_MINT.toBytes() ],
    //   [SEEDS["AUTHORITY_SEED"], USDC_MINT.toBytes()],
    //   program.programId
    // );

    // const [sol_vault] = PublicKey.findProgramAddressSync(
    //   [SEEDS["SOL_VAULT_SEED"], USDC_MINT.toBytes()],
    //   program.programId
    // );

    // const [token_vault] = PublicKey.findProgramAddressSync(
    //   [pool_authority.toBytes(), TOKEN_PROGRAM_ID.toBytes(), USDC_MINT.toBytes()],
    //   ASSOCIATED_TOKEN_PROGRAM_ID
    // );

    const getOrderBookDetail = (cfg: IResponsePoolInfoItem) => {
      const token_0_mint = new PublicKey(cfg.cpmm.mintA);
      const token_1_mint = new PublicKey(cfg.cpmm.mintB);

      const [order_book_detail] = PublicKey.findProgramAddressSync(
        [Buffer.from(ORDER_BOOK_DETAIL_SEED), token_0_mint.toBytes(), token_1_mint.toBytes()],
        program.programId
      );

      return order_book_detail;
    };

    // return { counter, order_config, pool_authority, sol_vault, token_vault, getOrderBookDetail };
    return { counter, order_config, getOrderBookDetail };
  };

  // const getPayerATA = () => {
  //   const [payer_ata] = PublicKey.findProgramAddressSync(
  //     [wallet.publicKey!.toBytes(), TOKEN_PROGRAM_ID.toBytes(), USDC_MINT.toBytes()],
  //     ASSOCIATED_TOKEN_PROGRAM_ID
  //   );

  //   return { payer_ata };
  // };

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

  const getNativeTokenAccount = () => {
    const associatedTokenAccount = getAssociatedTokenAddressSync(
      NATIVE_MINT,
      wallet.publicKey!,
      false,
      TOKEN_PROGRAM_ID
    );

    return associatedTokenAccount;
  };

  async function wrap_sol(amount: BN) {
    const wsol_account = getNativeTokenAccount();

    // console.log("🚀 ~ wrap_sol ~ wsol_account:", wsol_account.toBase58());

    const ix = await program.methods
      .wrapSol(amount)
      .accounts({
        payer: wallet.publicKey!,
        wsolAccount: wsol_account,
        wsolMint: NATIVE_MINT,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    return ix;
  }

  async function unwrap_sol() {
    const wsol_account = getNativeTokenAccount();

    const ix = await program.methods
      .unwrapSol()
      .accounts({
        authority: wallet.publicKey!,
        wsolAccount: wsol_account,
        wsolMint: NATIVE_MINT,
        destination: wallet.publicKey!,
      })
      .instruction();

    return ix;
  }

  async function cancel_order(
    pool_id: BN,
    order_id: BN,
    token_mint: string,
    cfg: IResponsePoolInfoItem
  ) {
    const { getOrderBookDetail } = getProgramAddress();

    const token_0_mint = new PublicKey(cfg.cpmm.mintA);
    const token_1_mint = new PublicKey(cfg.cpmm.mintB);

    const token_0_program = new PublicKey(cfg.cpmm.mintProgramA);
    const token_1_program = new PublicKey(cfg.cpmm.mintProgramB);

    const order_book_detail = getOrderBookDetail(cfg);

    const input_token_mint = token_mint === cfg.cpmm.mintA ? token_0_mint : token_1_mint;
    const output_token_mint = token_mint === cfg.cpmm.mintA ? token_1_mint : token_0_mint;

    const input_token_program =
      token_mint === token_0_mint.toBase58() ? token_0_program : token_1_program;

    const [pool_authority] = make_pool_authority(token_0_mint, token_1_mint);

    const input_token_vault = getAssociatedTokenAddressSync(
      input_token_mint,
      pool_authority,
      true,
      input_token_program
    );

    const input_token_account = getAssociatedTokenAddressSync(
      input_token_mint,
      wallet.publicKey!,
      false,
      input_token_program
    );

    const tx = new Transaction();

    console.log(
      `Maker: `,
      order_book_detail.toBase58(),
      pool_id.toString(),
      input_token_mint.toBase58(),
      output_token_mint.toBase58()
    );

    console.log(`Cancel Order Accounts: `, {
      payer: wallet.publicKey!.toBase58(),
      orderBookDetail: order_book_detail.toBase58(),
      orderBook: order_book(
        order_book_detail,
        pool_id,
        input_token_mint,
        output_token_mint
      ).toBase58(),
      inputTokenMint: input_token_mint.toBase58(),
      outputTokenMint: output_token_mint.toBase58(),
      inputTokenVault: input_token_vault.toBase58(),
      orderBookAuthority: pool_authority.toBase58(),
      inputTokenAccount: input_token_account.toBase58(),
      inputTokenProgram: input_token_program.toBase58(),
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID.toBase58(),
    });

    const ix = await program.methods
      .cancelOrder(pool_id, order_id)
      .accounts({
        payer: wallet.publicKey!,
        orderBookDetail: order_book_detail,
        orderBook: order_book(order_book_detail, pool_id, input_token_mint, output_token_mint),
        inputTokenMint: input_token_mint,
        outputTokenMint: output_token_mint,
        inputTokenVault: input_token_vault,
        orderBookAuthority: pool_authority,
        inputTokenAccount: input_token_account,
        inputTokenProgram: input_token_program,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const sig = await provider.sendAndConfirm(tx);
    transactionToast(sig);
    console.log(`Cancel Order ID: ${order_id}, pool_id: ${pool_id}`);
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
        Buffer.from(ORDER_BOOK_WITH_TOKEN_SEED),
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

    const isNativeMint = input_token_mint.equals(NATIVE_MINT);

    if (isNativeMint) {
      const ix = await wrap_sol(in_amount);
      tx.add(ix);
    }

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
    console.log("output_token_mint:", output_token_mint.toBase58());
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

    console.log(`Generate Buy Order ID: 1 , pool_id: ${pool_id} in_amount: ${in_amount}, `);
    return tx;
  }

  class SwapInfo {
    pool_state: IResponsePoolInfoItem;
    input_token_mint: PublicKey;
    output_token_mint: PublicKey;
    input_swap_amount: BN;
    input_token_vault: PublicKey;
    output_token_vault: PublicKey;
    input_token_balance?: TokenAmount;
    output_token_balance?: TokenAmount;
    orders: IOrderbookDepthItem[];
    token_0_mint: PublicKey;
    token_1_mint: PublicKey;
    input_token_program: PublicKey;
    output_token_program: PublicKey;

    constructor(
      pool_state: IResponsePoolInfoItem,
      input_token_mint: string,
      output_token_mint: string
    ) {
      this.input_token_mint = new PublicKey(input_token_mint);
      this.output_token_mint = new PublicKey(output_token_mint);

      const [input_token_vault, output_token_vault, input_token_program, output_token_program] =
        input_token_mint === pool_state.cpmm.mintA
          ? [
              pool_state.cpmm.vaultA,
              pool_state.cpmm.vaultB,
              pool_state.cpmm.mintProgramA,
              pool_state.cpmm.mintProgramB,
            ]
          : [
              pool_state.cpmm.vaultB,
              pool_state.cpmm.vaultA,
              pool_state.cpmm.mintProgramB,
              pool_state.cpmm.mintProgramA,
            ];

      this.input_token_vault = new PublicKey(input_token_vault);
      this.output_token_vault = new PublicKey(output_token_vault);

      this.input_token_program = new PublicKey(input_token_program);
      this.output_token_program = new PublicKey(output_token_program);

      this.pool_state = pool_state;
      this.token_0_mint = new PublicKey(pool_state.cpmm.mintA);
      this.token_1_mint = new PublicKey(pool_state.cpmm.mintB);
      this.orders = [] as IOrderbookDepthItem[];
    }

    async get_token_account_balance(token_account: PublicKey | string): Promise<TokenAmount> {
      if (typeof token_account === "string") {
        token_account = new PublicKey(token_account);
      }
      // const response = await program.provider.connection.getTokenAccountBalance( pubkey )
      const response = await connection.getTokenAccountBalance(token_account);

      if (response.value === null) {
        throw new Error(`Token account ${token_account} not found`);
      }

      return {
        ...response.value,
      };
    }

    add_orders(orders: IOrderbookDepthItem[] = []) {
      const now = Math.floor(Date.now() / 1000);
      // filter deadline
      this.orders = orders.filter((v) => {
        return v.deadline > now;
      });
    }

    async init_account_balance() {
      const [input_token_balance, output_token_balance] = await Promise.all([
        this.get_token_account_balance(this.input_token_vault),
        this.get_token_account_balance(this.output_token_vault),
      ]);

      // console.log(
      //   "🚀 ~ SwapInfo ~ init_account_balance ~ input_token_balance:",
      //   input_token_balance
      // );
      // console.log(
      //   "🚀 ~ SwapInfo ~ init_account_balance ~ output_token_balance:",
      //   output_token_balance
      // );

      this.input_token_balance = input_token_balance;
      this.output_token_balance = output_token_balance;
    }

    // async get_current_price(input_swap_amount: BN) {
    //   const input_token_amount = new BN(this.input_token_balance!.amount);
    //   const output_token_amount = new BN(this.output_token_balance!.amount);

    //   // Calculate the new output amount after swap using constant product formula
    //   const pre_output_amount = input_token_amount
    //     .mul(output_token_amount)
    //     .div(input_token_amount.add(input_swap_amount));

    //   // Calculate the actual output amount (difference between original and new output)
    //   const actual_output_amount = output_token_amount.sub(pre_output_amount);

    //   // Calculate price: (output_amount * 10^input_decimals) / (input_amount * 10^output_decimals)
    //   // const price =
    //   //   (parseFloat(actual_output_amount.toString()) *
    //   //     Math.pow(10, this.input_token_balance!.decimals)) /
    //   //   (parseFloat(input_swap_amount.toString()) *
    //   //     Math.pow(10, this.output_token_balance!.decimals));

    //   // const price = actual_output_amount
    //   //   .mul(new BN(10).pow(new BN(this.input_token_balance!.decimals)))
    //   //   .div(input_swap_amount.mul(new BN(10).pow(new BN(this.output_token_balance!.decimals))))
    //   //   .toNumber();

    //   const actual_output_amount_decimal = new Decimal(actual_output_amount.toString()).mul(
    //     10 ** this.input_token_balance!.decimals
    //   );
    //   const input_swap_amount_decimal = new Decimal(input_swap_amount.toString()).mul(
    //     10 ** this.output_token_balance!.decimals
    //   );

    //   const price = actual_output_amount_decimal.div(input_swap_amount_decimal);

    //   console.group("get_current_price");
    //   console.log("input_token_amount:", input_token_amount.toString());
    //   console.log("output_token_amount:", output_token_amount.toString());
    //   console.log("input_token_balance:", this.input_token_balance!.uiAmountString);
    //   console.log("output_token_balance:", this.output_token_balance!.uiAmountString);
    //   console.log("input_swap_amount:", input_swap_amount.toString());
    //   console.log("pre_output_amount:", pre_output_amount.toString());
    //   console.log("current_price:", price.toNumber());
    //   console.groupEnd();

    //   return {
    //     input: input_swap_amount,
    //     output: pre_output_amount,
    //     current_price: price.toNumber(),
    //   };
    // }

    async get_current_price(input_swap_amount: BN) {
      const input_token_amount = new BN(this.input_token_balance!.amount);
      const output_token_amount = new BN(this.output_token_balance!.amount);

      const pre_output_amount = output_token_amount.sub(
        input_token_amount.mul(output_token_amount).div(input_token_amount.add(input_swap_amount))
      );

      // const current_price = new Decimal(input_swap_amount.toString()).div(
      //   new Decimal(pre_output_amount.toString())
      // );
      const current_price =
        parseFloat(input_swap_amount.toString()) / parseFloat(pre_output_amount.toString());

      console.group("get_current_price");
      console.log("input_swap_amount:", input_swap_amount.toString());
      console.log("input_token_amount:", input_token_amount.toString());
      console.log("output_token_amount:", output_token_amount.toString());
      console.log("pre_output_amount:", pre_output_amount.toString());
      console.log("current_price:", current_price.toFixed(20));
      console.groupEnd();

      return {
        input: input_swap_amount,
        output: pre_output_amount,
        // current_price: current_price.toNumber(),
        current_price: current_price,
      };
    }

    find_orders(input_amount: BN) {
      // const { getOrderBookDetail } = getProgramAddress();

      const max = 2; // max = 2
      const pools = [] as PublicKey[];
      const trades = [] as Trade[];
      let count = 0;
      const v = {};
      let output_amount_count: BN = new BN(0);

      // const order_book_detail_v = getOrderBookDetail(this.pool_state);

      for (const order of this.orders) {
        const { pool_id, pool_pubkey, order_id, in_amount, out_amount } = order;

        // const order_book_v = order_book( order_book_detail_v, new BN(pool_id), this.input_token_mint, this.output_token_mint )
        const order_book_v = new PublicKey(pool_pubkey);

        // console.log( order_book_v.toBase58() , v[order_book_v.toBase58()], v[order_book_v.toBase58()] === undefined)
        if (v[order_book_v.toBase58()] === undefined) {
          if (count < max) {
            v[order_book_v.toBase58()] = count;
            count++;
            pools.push(order_book_v);
          } else {
            continue;
          }
        }

        // add order
        trades.push({
          poolIndex: new BN(v[order_book_v.toBase58()]),
          orderId: new BN(order_id),
        } as Trade);

        const in_amount_bn = new BN(in_amount);
        const out_amount_bn = new BN(out_amount);

        if (input_amount.gte(out_amount_bn)) {
          input_amount = input_amount.sub(out_amount_bn);
          output_amount_count = output_amount_count.add(in_amount_bn);
        } else {
          const left_output_amount = out_amount_bn
            .sub(input_amount)
            .mul(in_amount_bn)
            .div(out_amount_bn);
          output_amount_count = output_amount_count.add(in_amount_bn.sub(left_output_amount));
          input_amount = new BN(0);
        }

        if (input_amount.isZero()) {
          break;
        }
      }

      return {
        pools,
        trades,
        left_input_amount: input_amount,
        output_amount_count,
      };
    }

    async calc_buy_more(input_amount: BN) {
      const trades_v = this.find_orders(input_amount);

      const before_v = await this.get_current_price(input_amount);

      // console.group("calc_buy_more");
      // console.log("before_v:", before_v.current_price.toString());
      // console.log("before_v input:", before_v.input.toString());
      // console.log("before_v output:", before_v.output.toString());
      // console.groupEnd();

      const { left_input_amount, output_amount_count } = trades_v;

      let new_output_amount = output_amount_count;

      let from_swap = {
        input: new BN(0),
        output: new BN(0),
      };

      if (left_input_amount.isZero() === false) {
        from_swap = await this.get_current_price(left_input_amount);
        new_output_amount = output_amount_count.add(from_swap.output);
      }

      return {
        trades: trades_v,
        more: new_output_amount.sub(before_v.output) as BN,
        only_swap: before_v,
        buy_more: {
          from_order: {
            input: input_amount.sub(left_input_amount),
            output: output_amount_count,
          },
          from_swap: from_swap as {
            input: BN;
            output: BN;
            current_price: number;
          },
          result: {
            input: input_amount,
            output: new_output_amount,
          },
        },
      };
    }

    // slippage default 10 => 10/1000 = 1%
    async generate_tx(input_amount: BN, slippage: BN = new BN(10)) {
      const pre_v = new BN(1000);
      const settle_id = new BN(Date.now());

      const raydium_pubkey = new PublicKey(raydium_cp_swap);
      const POOL_AUTH_SEED = Buffer.from(utils.bytes.utf8.encode("vault_and_lp_mint_auth_seed"));
      const POOL_SEED = Buffer.from(utils.bytes.utf8.encode("pool"));
      const ORACLE_SEED = Buffer.from(utils.bytes.utf8.encode("observation"));

      const [POOL_AUTH_PUBKEY, POOL_AUTH_BUMP] = PublicKey.findProgramAddressSync(
        [POOL_AUTH_SEED],
        raydium_pubkey
      );
      const pool_state = new PublicKey(this.pool_state.cpmm.poolId);
      const ammConfig = new PublicKey(this.pool_state.cpmm.configId);
      // const swap_input_vault = new PublicKey(this.pool_state.vaultA)
      // const swap_output_vault = new PublicKey(this..vaultB)
      const swap_observation = new PublicKey(this.pool_state.cpmm.observationId);
      const [order_book_detail] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(ORDER_BOOK_DETAIL_SEED),
          this.token_0_mint.toBytes(),
          this.token_1_mint.toBytes(),
        ],
        program.programId
      );

      const default_pool = new PublicKey(config.defaultPool);
      // order_book( order_book_detail, new BN(0), this.token_0_mint, this.token_1_mint );

      const [settle_pool] = PublicKey.findProgramAddressSync(
        [
          SEEDS["SETTLE_POOL_SEED"],
          settle_id.toArrayLike(Buffer, "le", 8),
          this.input_token_mint.toBytes(),
          this.output_token_mint.toBytes(),
        ],
        program.programId
      );

      const input_token_account = getAssociatedTokenAddressSync(
        this.input_token_mint,
        wallet.publicKey!,
        false,
        this.input_token_program
      );

      const output_token_account = getAssociatedTokenAddressSync(
        this.output_token_mint,
        wallet.publicKey!,
        false,
        this.output_token_program
      );

      const [order_book_authority] = make_pool_authority(this.token_0_mint, this.token_1_mint);

      const orderbook_input_vault = getAssociatedTokenAddressSync(
        this.input_token_mint,
        order_book_authority,
        true,
        this.input_token_program
      );

      const orderbook_output_vault = getAssociatedTokenAddressSync(
        this.output_token_mint,
        order_book_authority,
        true,
        this.output_token_program
      );
      const buymore_info = await this.calc_buy_more(input_amount);

      if (buymore_info.trades.pools.length === 0) {
        buymore_info.trades.pools.push(default_pool);
      }

      const minimum_amount_out = buymore_info.only_swap.output.mul(pre_v.sub(slippage)).div(pre_v);

      console.group("generate_tx");
      console.log("🚀 ~ SwapInfo ~ generate_tx ~ input_amount:", input_amount.toString());
      console.log(
        "🚀 ~ SwapInfo ~ generate_tx ~ minimum_amount_out:",
        minimum_amount_out.toString()
      );
      console.log(
        "🚀 ~ SwapInfo ~ generate_tx ~ buymore_info:",
        buymore_info.trades.trades.map(
          (t) => `poolIndex: ${t.poolIndex.toString()} orderId: ${t.orderId.toString()}`
        )
      );
      console.groupEnd();

      const tx = new Transaction();

      const isNativeMint = this.input_token_mint.equals(NATIVE_MINT);

      if (isNativeMint) {
        const ix = await wrap_sol(input_amount);
        tx.add(ix);
      }

      // debugger;
      const ix = await program.methods
        .proxySwapBaseInput(settle_id, input_amount, minimum_amount_out, buymore_info.trades.trades)
        .accounts({
          cpSwapProgram: raydium_pubkey,
          payer: wallet.publicKey!,
          authority: POOL_AUTH_PUBKEY,
          ammConfig: ammConfig,
          poolState: pool_state,
          inputTokenAccount: input_token_account,
          outputTokenAccount: output_token_account,
          inputVault: this.input_token_vault,
          outputVault: this.output_token_vault,
          inputTokenProgram: this.input_token_program,
          outputTokenProgram: this.output_token_program,
          inputTokenMint: this.input_token_mint,
          outputTokenMint: this.output_token_mint,
          observationState: swap_observation,
          orderBook0: buymore_info.trades.pools[0],
          orderBook1: buymore_info.trades.pools[1] || buymore_info.trades.pools[0], // set by yourself.
          orderBookInputVault: orderbook_input_vault,
          orderBookOutputVault: orderbook_output_vault,
          orderBookDetail: order_book_detail,
          orderBookAuthority: order_book_authority,
          settlePool: settle_pool,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .instruction();

      tx.add(ix);

      if (!isNativeMint) {
        const ix = await unwrap_sol();
        tx.add(ix);
      }

      const sig1 = await provider.sendAndConfirm(tx);
      console.log("Your transaction signature", sig1);
      transactionToast(sig1);

      return tx;
    }
  }

  return {
    add_order_v2,
    initialize_pool,
    program,
    cancel_order,
    solToWsol,
    SwapInfo,
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
