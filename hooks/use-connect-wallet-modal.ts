import { atom, useAtom } from "jotai";

const connectWalletModalOpenAtom = atom<boolean>(false);

export function useConnectWalletModalOpen() {
  return useAtom(connectWalletModalOpenAtom);
}
