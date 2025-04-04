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

  async function trade_in(in_v: number, out_v: number) {
    const tx = new Transaction();

    const raydium_pubkey = new PublicKey(raydium_cp_swap);

    const POOL_AUTH_SEED = Buffer.from(utils.bytes.utf8.encode("vault_and_lp_mint_auth_seed"));
    const POOL_SEED = Buffer.from(utils.bytes.utf8.encode("pool"));
    const ORACLE_SEED = Buffer.from(utils.bytes.utf8.encode("observation"));

    const configAddress = new PublicKey("9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6");

    // const input_token_mint = SOL_MINT       //new PublicKey('')
    // // const output_token_mint = USDC_MINT     //new PublicKey('')
    // const output_token_mint = new PublicKey('CaTR571CjUwC3ALHpmuZzvJzYJYc7G2iaDKMqb4sDaHN')

    const [POOL_AUTH_PUBKEY, POOL_AUTH_BUMP] = PublicKey.findProgramAddressSync(
      [POOL_AUTH_SEED],
      raydium_pubkey
    );

    // // pool_id   SOL/USDC
    // // const pool_state = new PublicKey('26auA3dMfiqK8SWBCkzShhkaSTbbWYQ3jrwhBQZCW5gT')

    // const [pool_state, pool_state_bump] = await getPoolAddress(
    //     configAddress,
    //     input_token_mint,
    //     output_token_mint,
    //     raydium_pubkey
    // )

    // console.log( pool_state.toBase58() )

    // // const input_token_account = new PublicKey('So11111111111111111111111111111111111111112')
    // // const output_token_account = new PublicKey('9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U')

    const env = {
      poolId: "427aCk5aRuXpUshfiaD9xewC3RRkj9uZDnzM4eUQ3bPm",
      mintA: "So11111111111111111111111111111111111111112",
      mintB: "H8RAUbA1PH8Gjaxj7awyf53TMrjBKNTQRQMM6TqGLQV8",
      vaultA: "HPnzZnEBeoRSSAMysZdWH3yWuaH96xmJ2sTXD727KPaA",
      vaultB: "CJ8zGLhDx5vxwYvYtba9t38h2MPjzhLVJAADAhzEotkT",
      observationId: "7f5yJ7stjZ876dZY2uYMrp5qzdER15RDjorXKbxn9wKM",
      mintLp: "9DhJcmNAEjBij8uXuAZMSaio3t3J9imsWdLwDaRzy4zZ",
      configId: "9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6",
      poolCreator: "panACusRPNRs9Q2hTSzCnCSiWG8ysK5KeA5Nyib43SR",
      mintProgramA: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      mintProgramB: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      bump: 255,
      status: 0,
      lpDecimals: 9,
      mintDecimalA: 9,
      mintDecimalB: 9,
      openTime: "674d886b",
      lpAmount: "04184ac7c225",
      protocolFeesMintA: "00",
      protocolFeesMintB: "00",
      fundFeesMintA: "00",
      fundFeesMintB: "00",
    };

    const input_token_mint = new PublicKey(env.mintA);
    const output_token_mint = new PublicKey(env.mintB);

    const input_token_program = new PublicKey(env.mintProgramA);
    const output_token_program = new PublicKey(env.mintProgramB);
    const pool_state = new PublicKey(env.poolId);

    const input_token_account = getAssociatedTokenAddressSync(
      input_token_mint,
      wallet.publicKey!,
      false,
      input_token_program
    );

    const inputAccountInfo = await program.provider.connection.getAccountInfo(input_token_account);
    console.log(`Input token account: ${inputAccountInfo}`);
    if (!inputAccountInfo) {
      const ix = createAssociatedTokenAccountInstruction(
        wallet.publicKey!,
        input_token_mint,
        wallet.publicKey!,
        input_token_program,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      tx.add(ix);
    }

    const output_token_account = getAssociatedTokenAddressSync(
      output_token_mint,
      wallet.publicKey!,
      false,
      output_token_program
    );

    const outputAccountInfo =
      await program.provider.connection.getAccountInfo(output_token_account);
    console.log(`Output token account: ${outputAccountInfo}`);

    if (!outputAccountInfo) {
      const ix = createAssociatedTokenAccountInstruction(
        wallet.publicKey!,
        output_token_mint,
        wallet.publicKey!,
        output_token_program,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      tx.add(ix);
    }

    const [input_vault_account] = await getPoolVaultAddress(
      pool_state,
      input_token_mint,
      raydium_pubkey
    );

    const [output_vault_account] = await getPoolVaultAddress(
      pool_state,
      output_token_mint,
      raydium_pubkey
    );

    const [OB_STATE_ADDRESS, OB_STATE_BUMP] = PublicKey.findProgramAddressSync(
      [ORACLE_SEED, pool_state.toBuffer()],
      raydium_pubkey
    );

    // ready pool state from contract

    const in_amount = new BN(in_v);
    const out_amount = new BN(out_v);

    // await delay(20 * 1000);

    // console.log(input_token_account.toBase58());
    // console.log(output_token_account.toBase58());
    // const ix = await program.methods
    //   .proxySwapBaseInput(in_amount, out_amount)
    //   .accounts({
    //     cpSwapProgram: raydium_pubkey,
    //     payer: wallet.publicKey!,
    //     poolState: pool_state,
    //     authority: POOL_AUTH_PUBKEY,
    //     ammConfig: configAddress,
    //     inputTokenAccount: input_token_account,
    //     outputTokenAccount: output_token_account,
    //     inputVault: new PublicKey(env.vaultA),
    //     outputVault: new PublicKey(env.vaultB),
    //     inputTokenMint: input_token_mint,
    //     outputTokenMint: output_token_mint,
    //     inputTokenProgram: input_token_program,
    //     outputTokenProgram: output_token_program,
    //     observationState: new PublicKey(env.observationId),
    //   })
    //   .instruction();
    // .accounts({
    //     cpSwapProgram: raydium_pubkey,
    //     payer: wallet.publicKey,
    //     poolState: pool_state,
    //     authority: POOL_AUTH_PUBKEY,
    //     ammConfig: configAddress,
    //     // raydiumCpSwap: raydium_pubkey,
    //     inputTokenAccount: input_token_account,
    //     outputTokenAccount: output_token_account,
    //     inputVault: input_vault_account,
    //     outputVault: output_vault_account,
    //     inputTokenProgram: input_token_program,
    //     outputTokenProgram: output_token_program,
    //     inputTokenMint: input_token_mint,
    //     outputTokenMint: output_token_mint,
    //     observationState: OB_STATE_ADDRESS
    //     // tokenProgram: TOKEN_PROGRAM_ID,
    // }).instruction();

    // tx.add(ix);

    // const sig = await provider.sendAndConfirm(tx);
    // console.log("Your transaction signature", sig);
    // transactionToast(sig);
    // console.log(`Trade In: ${in_v} SOL -> ${out_v} USD`);
  }

  const make_pool_authority = (token_0_mint: PublicKey, token_1_mint: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [SEEDS["AUTHORITY_SEED"], token_0_mint.toBytes(), token_1_mint.toBytes()],
      program.programId
    );
  };

  const order_book = (order_book_detail, pool_id, input_token_mint, output_token_mint) => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("buymore_order_with_token_v1"),
        order_book_detail.toBuffer(),
        new Uint8Array(pool_id.toArray("le", 8)),
        input_token_mint.toBuffer(),
        output_token_mint.toBuffer(),
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

  async function add_order_v1(
    input_token_mint: PublicKey,
    output_token_mint: PublicKey,
    input_token_program: PublicKey,
    output_token_program: PublicKey,
    in_amount: BN,
    out_amount: BN,
    pool_id: BN,
    cfg: IResponsePoolInfoItem
  ) {
    console.log("🚀 ~ useHybirdTradeProgram ~ pool_id:", pool_id.toString());

    const { counter, getOrderBookDetail } = getProgramAddress();
    const tx = new Transaction();

    const token_0_mint = new PublicKey(cfg.cpmm.mintA);
    const token_1_mint = new PublicKey(cfg.cpmm.mintB);

    const token_0_program = new PublicKey(cfg.cpmm.mintProgramA);
    const token_1_program = new PublicKey(cfg.cpmm.mintProgramB);

    const input_token_ata = getAssociatedTokenAddressSync(
      input_token_mint,
      wallet.publicKey!,
      false,
      input_token_program
    );

    const accountInfo = await program.provider.connection.getAccountInfo(input_token_ata);
    console.log("🚀 ~ add_order_v1 ~ accountInfo:", !!accountInfo);
    if (!accountInfo) {
      // const tx = new Transaction();
      const ix = createAssociatedTokenAccountInstruction(
        wallet.publicKey!,
        input_token_ata,
        wallet.publicKey!,
        token_0_mint,
        token_0_program
      );

      tx.add(ix);
      // const sig = await provider.sendAndConfirm(tx);
      // console.log("Your transaction signature", sig);
      // transactionToast(sig);
      // return;
    }

    const [initialize_pool_authority] = make_pool_authority(token_0_mint, token_1_mint);

    const poolAccount = await program.provider.connection.getAccountInfo(initialize_pool_authority);
    // console.log("🚀 ~ add_order_v1 ~ poolAccount:", poolAccount);
    // if (!poolAccount) {
    //   const ix = createAssociatedTokenAccountInstruction(
    //     wallet.publicKey!,
    //     initialize_pool_authority,
    //     wallet.publicKey!,
    //     token_0_mint,
    //     token_0_program
    //   );
    //   tx.add(ix);
    // }

    const token_vault = getAssociatedTokenAddressSync(
      token_0_mint,
      initialize_pool_authority,
      true,
      token_0_program
    );

    const order_book_detail = getOrderBookDetail(cfg);
    const now = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1day
    // const in_amount = new anchor.BN( 10000 )
    // const out_amount = new anchor.BN( 1000 )
    const now_v = new BN(now);

    // const tx = new Transaction();

    const ix = await program.methods
      .addOrderToPool(pool_id, in_amount, out_amount, now_v)
      .accounts({
        payer: wallet.publicKey!,
        inputTokenMint: token_0_mint,
        outputTokenMint: token_1_mint,
        orderBookDetail: order_book_detail,
        orderBook: order_book(order_book_detail, pool_id, input_token_mint, output_token_mint),
        inputTokenAta: input_token_ata,
        inputTokenVault: token_vault,
        poolAuthority: initialize_pool_authority,
        counter,
        tokenProgram: input_token_program,
      })
      .instruction();

    tx.add(ix);

    const sig1 = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", sig1);
    transactionToast(sig1);
    console.log(
      `Generate Buy Order ID: 1 , pool_id: ${pool_id} in_amount: ${in_amount}, out_amount: ${out_amount}, now: ${now_v}`
    );
  }

  return {
    add_order_v1,
    initialize_pool,
    program,
    cancelOrder,
    trade_in,
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
