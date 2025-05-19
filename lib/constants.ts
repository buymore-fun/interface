export const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

export const solChangeToToken = (token: string) => {
  if (token === "sol") {
    return SOL_ADDRESS;
  }
  return token;
};
