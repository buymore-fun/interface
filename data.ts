import { BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

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
  const pre_output_amount = input_token_amount.mul(output_token_amount).div(input_token_amount.add(input_swap_amount));

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

for (const amount of testAmounts) {
  console.log(`\nTesting with input amount: ${amount}`);
  get_current_price(new BN(amount * 10 ** input_token_balance.decimals));
}
