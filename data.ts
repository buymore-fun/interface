import { BN } from "@coral-xyz/anchor";
import { Metaplex, MetaplexOptions } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata"; // 导入 Metadata 类型

const input_token_balance = {
  amount: "1964134028",
  decimals: 9,
  uiAmount: 1.964134028,
  uiAmountString: "1.964134028",
};

const output_token_balance = {
  amount: "25542298625",
  decimals: 6,
  uiAmount: 25542.298625,
  uiAmountString: "25542.298625",
};

export async function get_current_price(input_swap_amount: BN) {
  const input_token_amount = new BN(input_token_balance!.amount);
  const output_token_amount = new BN(output_token_balance!.amount);

  // Calculate the new output amount after swap using constant product formula
  const pre_output_amount = input_token_amount
    .mul(output_token_amount)
    .div(input_token_amount.add(input_swap_amount));

  // Calculate the actual output amount (difference between original and new output)
  const actual_output_amount = output_token_amount.sub(pre_output_amount);

  // Calculate price: (output_amount * 10^input_decimals) / (input_amount * 10^output_decimals)
  const price =
    (parseFloat(actual_output_amount.toString()) * Math.pow(10, input_token_balance.decimals)) /
    (parseFloat(input_swap_amount.toString()) * Math.pow(10, output_token_balance.decimals));

  console.group("get_current_price");
  console.log("input_token_amount:", input_token_amount.toString());
  console.log("output_token_amount:", output_token_amount.toString());
  console.log("input_swap_amount:", input_swap_amount.toString());
  console.log("pre_output_amount:", pre_output_amount.toString());
  console.log("actual_output_amount:", actual_output_amount.toString());
  console.log("price:", price.toString());
  console.groupEnd();

  return {
    input: input_swap_amount,
    output: actual_output_amount,
    price: price,
  };
}

// Test with different input amounts
const testAmounts = [
  // 0.000000001, // Very small amount
  0.00001,
  0.001,
  0.1, // Small amount
  0.2,
  0.3,
  1, // Medium amount
  10, // Large amount
  1000, // Very large amount
];

// Calculate current market price
const current_market_price =
  parseFloat(output_token_balance.uiAmountString) / parseFloat(input_token_balance.uiAmountString);

console.log("Current market price:", current_market_price.toString());

// for (const amount of testAmounts) {
//   console.log(`\nTesting with input amount: ${amount}`);
//   get_current_price(new BN(amount * 10 ** input_token_balance.decimals));
// }

async function getTokenMetadata(mintAddress: string) {
  // 1. 设置连接
  // 可以换成 'devnet', 'testnet' 或你自己的 RPC 节点
  const connection = new Connection(clusterApiUrl("devnet"));

  // 2. 创建 Metaplex 实例
  // 对于只读操作，通常只需要 connection
  const metaplex = Metaplex.make(connection);

  try {
    // 3. 将字符串地址转换为 PublicKey
    const mintPublicKey = new PublicKey(mintAddress);

    // 4. 调用 findByMint 获取元数据
    // 这个方法会同时获取链上数据和链下 JSON 数据 (如果 URI 存在且可访问)
    console.log(`正在查找 Mint Address: ${mintAddress} 的元数据...`);
    const metadata = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

    // 5. 处理结果
    if (!metadata) {
      console.log("未找到该 Mint Address 的 Metaplex 元数据。");
      return;
    }

    console.log("\n--- 链上元数据 (部分) ---");
    console.log("名称 (Name):", metadata.name);
    console.log("符号 (Symbol):", metadata.symbol);
    console.log("URI:", metadata.uri);
    console.log("是否可变 (Is Mutable):", metadata.isMutable);
    console.log("主要销售发生 (Primary Sale Happened):", metadata.primarySaleHappened);
    console.log("卖家费用基点 (Seller Fee Basis Points):", metadata.sellerFeeBasisPoints);
    // console.log("创作者 (Creators):", metadata.creators); // 创作者信息比较复杂，可以按需展开

    // 'metadata.json' 包含了从 URI 获取的链下 JSON 数据
    // 注意：如果 URI 无效或无法访问，json 可能为 null 或获取失败
    if (metadata.json) {
      console.log("\n--- 链下 JSON 元数据 (来自 URI) ---");
      console.log("描述 (Description):", metadata.json.description);
      console.log("图片 (Image):", metadata.json.image);
      // 可以根据 JSON 结构访问其他字段，例如 attributes
      if (metadata.json.attributes) {
        console.log("属性 (Attributes):", metadata.json.attributes);
      }
    } else if (metadata.uri) {
      console.log("\n--- 无法加载链下 JSON 元数据 ---");
      console.log(`无法从 URI [${metadata.uri}] 加载 JSON 数据，请检查 URI 是否有效且可公开访问。`);
    } else {
      console.log("\n--- 没有链下 JSON 元数据 ---");
      console.log("此代币没有配置 URI。");
    }

    // 你也可以直接访问原始的链上 Metadata 账户数据结构 (如果需要更底层的字段)
    // const onChainMetadata = metadata.metadataAccount.data;
    // console.log("\n--- 原始链上数据 ---");
    // console.log(onChainMetadata);
  } catch (error) {
    console.error("获取元数据时出错:", error);
    if (error instanceof Error && error.message.includes("Account does not exist")) {
      console.error(
        `错误详情：可能 ${mintAddress} 不是一个有效的 Mint Account 地址，或者它没有关联的 Metaplex Metadata Account。`
      );
    } else if (error instanceof Error && error.message.includes("Invalid public key input")) {
      console.error(
        `错误详情：提供的地址 "${mintAddress}" 不是一个有效的 Solana Public Key 格式。`
      );
    }
  }
}

// --- 使用示例 ---
// 替换为你想要查询的代币的 Mint Address
// 示例 1: 一个 NFT (例如 Mad Lads #1)
// const nftMintAddress = "B6hpbq4u5z94jTuFoRufrXyu17uC82Mpr3if11RRwCfK";
// getTokenMetadata(nftMintAddress);

// 示例 2: 一个 Fungible Token (例如 $BONK)
const fungibleTokenMintAddress = "Ge7idPM1KBtu8Dzt5QsrWRxMNmv2KYSwzesXiCdkn84u";
getTokenMetadata(fungibleTokenMintAddress);

// 示例 3: 一个没有 Metaplex Metadata 的 SPL Token (例如 Wrapped SOL)
// const noMetadataTokenMintAddress = "So11111111111111111111111111111111111111112";
// getTokenMetadata(noMetadataTokenMintAddress); // 这个会报错或提示找不到元数据

// 示例 4: 一个无效地址
// const invalidAddress = "NotARealAddress";
// getTokenMetadata(invalidAddress); // 这个会报错
