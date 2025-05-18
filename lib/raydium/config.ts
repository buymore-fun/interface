import { Raydium, TxVersion, parseTokenAccountResp } from "@raydium-io/raydium-sdk-v2";
import { Connection, Keypair, clusterApiUrl, PublicKey, Cluster } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import config, { getWalletAdapterNetwork, network } from "@/config";

const PAID_RPC_ENDPOINTS = {
  //  paid rpc
  "mainnet-beta": [
    "https://rpc.ankr.com/solana/1609e828512967e228912bddd9c2a7ae07993932901d74d1277c37fc8165c3af",
    "https://mainnet.helius-rpc.com/?api-key=806e5319-b980-41ad-9739-61cce20d0c28",
  ],
};

export const getConnectionEndpoint = () => {
  if (config.walletAdapterNetwork === "mainnet-beta") {
    const paidRpc = PAID_RPC_ENDPOINTS["mainnet-beta"][0];
    console.log(`[Solana RPC] Using PAID RPC for mainnet-beta: ${paidRpc}`);
    return paidRpc;
  }

  const publicRpc = clusterApiUrl(config.walletAdapterNetwork);
  console.log(`[Solana RPC] Using public RPC for ${config.walletAdapterNetwork}: ${publicRpc}`);
  return publicRpc;
};

export const connection = new Connection(getConnectionEndpoint());

export const txVersion = TxVersion.V0; // or TxVersion.LEGACY
const cluster = config.walletAdapterNetwork as any;

let raydium: Raydium | undefined;
export const initSdk = async (params?: { loadToken?: boolean; owner: PublicKey }) => {
  if (raydium) return raydium;
  debugger;

  // if (connection.rpcEndpoint === clusterApiUrl("mainnet-beta")) {
  //   console.warn(
  //     "using free rpc node might cause unexpected error, strongly suggest uses paid rpc node"
  //   );
  // }

  console.log(`connect to rpc ${connection.rpcEndpoint} in ${cluster}`);
  raydium = await Raydium.load({
    owner: params?.owner,
    connection,
    cluster,
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
    blockhashCommitment: "finalized",
    // urlConfigs: {
    //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
    // },
  });

  /**
   * By default: sdk will automatically fetch token account data when need it or any sol balace changed.
   * if you want to handle token account by yourself, set token account data after init sdk
   * code below shows how to do it.
   * note: after call raydium.account.updateTokenAccount, raydium will not automatically fetch token account
   */

  /*  
  raydium.account.updateTokenAccount(await fetchTokenAccountData())
  connection.onAccountChange(owner.publicKey, async () => {
    raydium!.account.updateTokenAccount(await fetchTokenAccountData())
  })
  */

  return raydium;
};

export const fetchTokenAccountData = async (owner: Keypair) => {
  const solAccountResp = await connection.getAccountInfo(owner.publicKey);
  const tokenAccountResp = await connection.getTokenAccountsByOwner(owner.publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });
  const token2022Req = await connection.getTokenAccountsByOwner(owner.publicKey, {
    programId: TOKEN_2022_PROGRAM_ID,
  });
  const tokenAccountData = parseTokenAccountResp({
    owner: owner.publicKey,
    solAccountResp,
    tokenAccountResp: {
      context: tokenAccountResp.context,
      value: [...tokenAccountResp.value, ...token2022Req.value],
    },
  });
  return tokenAccountData;
};
