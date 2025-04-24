import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Decimal from "decimal.js";

function getFormatterRule(input: number) {
  const rules = [
    {
      exact: 0,
      formatterOptions: {
        notation: "standard",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      },
    },
    {
      upperBound: 0.000001,
      hardCodedInput: { input: 0.000001, prefix: "<" },
      formatterOptions: {
        notation: "standard",
        maximumFractionDigits: 6,
        minimumFractionDigits: 6,
      },
    },
    {
      upperBound: 1,
      formatterOptions: {
        notation: "standard",
        maximumFractionDigits: 5,
        minimumFractionDigits: 3,
      },
    },
    {
      upperBound: 1e6,
      formatterOptions: {
        notation: "standard",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
    },
    {
      upperBound: 1e15,
      formatterOptions: {
        notation: "compact",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
    {
      upperBound: Infinity,
      hardCodedInput: { input: 999_000_000_000_000, prefix: ">" },
      formatterOptions: {
        notation: "compact",
        maximumFractionDigits: 2,
      },
    },
  ];
  for (const rule of rules) {
    if (
      (rule.exact !== undefined && input === rule.exact) ||
      (rule.upperBound !== undefined && input < rule.upperBound)
    ) {
      return rule;
    }
  }

  return { hardCodedInput: undefined, formatterOptions: undefined };
}

export function formatNumber(input: number | string | undefined, placeholder = "-"): string {
  const locale = "en-US";

  if (input === null || input === undefined) {
    return placeholder;
  }

  if (typeof input === "string") {
    input = parseFloat(input);
  }

  const { hardCodedInput, formatterOptions } = getFormatterRule(input);

  if (!formatterOptions) {
    return placeholder;
  }

  if (!hardCodedInput) {
    return new Intl.NumberFormat(locale, formatterOptions as any).format(input);
  }

  const { input: hardCodedInputValue, prefix } = hardCodedInput;
  if (hardCodedInputValue === undefined) return placeholder;

  return (
    (prefix ?? "") +
    new Intl.NumberFormat(locale, formatterOptions as any).format(hardCodedInputValue)
  );
}

export function formatBalance(
  balance: number | string,
  toFixed: number = 4,
  decimals: number = LAMPORTS_PER_SOL
): string {
  const solBalance = new Decimal(balance).div(new Decimal(decimals)).toNumber();

  const formattedBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: toFixed,
    maximumFractionDigits: toFixed,
  }).format(solBalance);

  return formattedBalance;
}

export function formatPrice(price: number | string, toFixed: number = 12) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: toFixed,
  }).format(+price);

  return formattedPrice;
}

function getFormatterRuleCompact(input: number) {
  const rules = [
    {
      exact: 0,
      formatterOptions: {
        notation: "standard",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      },
    },
    {
      upperBound: 1,
      formatterOptions: {
        notation: "standard",
        maximumFractionDigits: 5,
        minimumFractionDigits: 3,
      },
    },
    {
      upperBound: 1e3, // Up to 1,000 (K)
      formatterOptions: {
        notation: "standard",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
    },
    {
      upperBound: 1e6, // Up to 1,000,000 (M)
      formatterOptions: {
        notation: "compact",
        compactDisplay: "short", // Shows K for thousands
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
    },
    {
      upperBound: 1e9, // Up to 1,000,000,000 (B)
      formatterOptions: {
        notation: "compact",
        compactDisplay: "short", // Shows M for millions
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
    },
    {
      upperBound: 1e12, // Up to 1,000,000,000,000 (T)
      formatterOptions: {
        notation: "compact",
        compactDisplay: "short", // Shows B for billions
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
    },
    {
      upperBound: 1e15, // Up to quadrillion
      formatterOptions: {
        notation: "compact",
        compactDisplay: "short", // Shows T for trillions
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
    },
    {
      upperBound: Infinity,
      hardCodedInput: { input: 999_000_000_000_000, prefix: ">" },
      formatterOptions: {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 2,
      },
    },
  ];
  for (const rule of rules) {
    if (
      (rule.exact !== undefined && input === rule.exact) ||
      (rule.upperBound !== undefined && input < rule.upperBound)
    ) {
      return rule;
    }
  }

  return { hardCodedInput: undefined, formatterOptions: undefined };
}

export function formatNumberCompact(input: number | string) {
  const { formatterOptions } = getFormatterRuleCompact(+input);

  return new Intl.NumberFormat("en-US", formatterOptions as any).format(+input);
}

/**
 * Formats a number according to specific rules:
 * 1. For numbers < 1: Shows 4 digits after the first non-zero digit
 * 2. For numbers >= 1: Shows exactly 2 decimal places
 *
 * @param input - The number to format
 * @param decimals - Optional specific number of decimal places to use
 * @param roundDown - Whether to round down (floor) or round to nearest (default: true)
 * @returns The formatted number as a string
 */
export function formatDecimal(
  input: number | string,
  decimals?: number,
  roundDown: boolean = true
): string {
  if (!input && input !== 0) return "";

  const num = typeof input === "string" ? parseFloat(input) : input;

  // If decimals is explicitly provided, use that
  if (decimals !== undefined) {
    const factor = Math.pow(10, decimals);
    const formattedValue = roundDown
      ? Math.floor(num * factor) / factor
      : Math.round(num * factor) / factor;
    return formattedValue.toFixed(decimals);
  }

  // For numbers >= 1, always show exactly 2 decimal places
  if (num >= 1) {
    const factor = Math.pow(10, 2);
    const formattedValue = roundDown
      ? Math.floor(num * factor) / factor
      : Math.round(num * factor) / factor;
    return formattedValue.toFixed(2);
  }

  // For numbers < 1, show 4 digits after first non-zero digit
  if (num > 0) {
    // Convert to string to analyze the digits
    const strNum = num.toString();
    const decimalPos = strNum.indexOf(".");

    // Find position of first non-zero digit after decimal
    let firstNonZeroPos = -1;

    for (let i = decimalPos + 1; i < strNum.length; i++) {
      if (strNum[i] !== "0") {
        firstNonZeroPos = i;
        break;
      }
    }

    if (firstNonZeroPos !== -1) {
      // Calculate significant digits to show (4 digits after first non-zero)
      const significantDigits = 4;
      const totalDecimals = firstNonZeroPos - decimalPos + significantDigits - 1;

      // Format with the calculated precision
      const factor = Math.pow(10, totalDecimals);
      const formattedValue = roundDown
        ? Math.floor(num * factor) / factor
        : Math.round(num * factor) / factor;

      return formattedValue.toFixed(totalDecimals);
    }
  }

  // Handle zero or other edge cases
  return num.toFixed(4);
}

/**
 * Formats a number by rounding down and removing trailing zeros
 * @param input - The number to format
 * @param decimals - Maximum number of decimal places to keep
 * @param isFloor - Whether to round down (true) or round to nearest (false)
 * @returns Formatted number as a string with unnecessary zeros removed
 */
export function formatFloor(
  input: number | string,
  decimals?: number,
  isFloor: boolean = true
): string {
  if (!input && input !== 0) return "";

  const flooredValue = formatDecimal(input, decimals, isFloor);

  // Remove trailing zeros after the decimal point
  return flooredValue.replace(/\.?0+$/, "").replace(/\.$/, "");
}
