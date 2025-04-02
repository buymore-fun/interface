"use client";

import { BN, Program, utils } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey, SystemProgram, Transaction, Signer } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getHybirdTradeProgram, getHybirdTradeProgramId, getSeeds } from "@/anchor/src";
import { useAnchorProvider } from "@/app/solana-provider";
import { useTransactionToast } from "@/hooks/use-transaction-toast";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { OrderType } from "@/consts/order";
import {
  // TODO  default is TOKEN_PROGRAM_ID, add dynamic params
  TOKEN_PROGRAM_ID as TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID as ATA_PROGRAM_ID,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
  getAccount,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { getPoolVaultAddress } from "@/hooks/hybird-trade/pda";
import { createAssociatedLedgerAccountInstruction } from "@raydium-io/raydium-sdk-v2";

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

  // const [ order_book_detail ] = PublicKey.findProgramAddressSync(
  //     // [ Buffer.from(`buymore_order_detail_${VERSION}`), USDC_MINT.toBytes()],
  //     [ SEEDS['orderDetailSeed'], USDC_MINT.toBytes()],
  //     program.programId
  // )

  const [sol_vault] = PublicKey.findProgramAddressSync(
    [SEEDS["SOL_VAULT_SEED"], USDC_MINT.toBytes()],
    program.programId
  );

  const [token_vault] = PublicKey.findProgramAddressSync(
    [pool_authority.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), USDC_MINT.toBytes()],
    ATA_PROGRAM_ID
  );

  const [payer_ata] = PublicKey.findProgramAddressSync(
    [wallet.publicKey!.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), USDC_MINT.toBytes()],
    ATA_PROGRAM_ID
  );

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

  const addOrder = async (
    in_amount: BN,
    out_amount: BN,
    order_type: number,
    pool_id: BN,
    expiryTime?: number
  ) => {
    const now = expiryTime || Math.floor(Date.now() / 1000) + 60 * 60 * 365;

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

  const sol_to_wsol = async (to: PublicKey, amount: number) => {
    const tx = new Transaction();

    tx.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: to,
        lamports: amount,
      }),
      createSyncNativeInstruction(to, TOKEN_2022_PROGRAM_ID)
    );

    const signature = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", signature);
    transactionToast(signature);
    return signature;
  };

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

    // const input_token_program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    // const output_token_program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

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
        ATA_PROGRAM_ID
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
        ATA_PROGRAM_ID
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

    console.log(input_token_account.toBase58());
    console.log(output_token_account.toBase58());
    const ix = await program.methods
      .proxySwapBaseInput(in_amount, out_amount)
      .accounts({
        cpSwapProgram: raydium_pubkey,
        payer: wallet.publicKey!,
        poolState: pool_state,
        authority: POOL_AUTH_PUBKEY,
        ammConfig: configAddress,
        inputTokenAccount: input_token_account,
        outputTokenAccount: output_token_account,
        inputVault: new PublicKey(env.vaultA),
        outputVault: new PublicKey(env.vaultB),
        inputTokenMint: input_token_mint,
        outputTokenMint: output_token_mint,
        inputTokenProgram: input_token_program,
        outputTokenProgram: output_token_program,
        observationState: new PublicKey(env.observationId),
      })
      .instruction();
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
    //     // tokenProgram: TOKEN_2022_PROGRAM_ID,
    // }).instruction();

    tx.add(ix);

    const sig = await provider.sendAndConfirm(tx);
    console.log("Your transaction signature", sig);
    transactionToast(sig);
    console.log(`Trade In: ${in_v} SOL -> ${out_v} USD`);
  }
  return {
    program,
    // fetchPoolData,
    initializePool,
    addOrder,
    cancelOrder,
    trade_in,
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
