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

export function formatNumber(
  input: number | string | undefined,
  placeholder = "-"
): string {
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
    // eslint-disable-next-line
    return new Intl.NumberFormat(locale, formatterOptions as any).format(input);
  }

  const { input: hardCodedInputValue, prefix } = hardCodedInput;
  if (hardCodedInputValue === undefined) return placeholder;

  return (
    (prefix ?? "") +
    // eslint-disable-next-line
    new Intl.NumberFormat(locale, formatterOptions as any).format(
      hardCodedInputValue
    )
  );
}
