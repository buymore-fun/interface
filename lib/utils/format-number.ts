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
  toFixed: number = 3,
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
