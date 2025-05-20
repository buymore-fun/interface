export const SOL_ADDRESS = "So11111111111111111111111111111111111111112";
export const DEFAULT_OUTPUT_TOKEN = "D9dxAwSCC27vdRH6gH4RLFiuCMzxarcBFmfzMS1mKvW9";

export const solChangeToToken = (token: string) => {
  if (token === "sol") {
    return SOL_ADDRESS;
  }
  return token;
};
