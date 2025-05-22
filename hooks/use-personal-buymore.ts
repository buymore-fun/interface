import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { usePersonalBuyMoreService } from "@/hooks/services";
import { IResponsePersonalBuyMore } from "@/types";
// Personal buy more   atoms
const personalBuyMoreAtom = atom<string>("");
const personalBuyMoreLoadingAtom = atom<boolean>(false);
const personalBuyMoreErrorAtom = atom<Error | null>(null);

export function usePersonalBuyMore(wallet: string) {
  const [personalBuyMore, setPersonalBuyMore] = useAtom(personalBuyMoreAtom);
  const [isPersonalBuyMoreLoading, setIsPersonalBuyMoreLoading] = useAtom(
    personalBuyMoreLoadingAtom
  );
  const [personalBuyMoreError, setPersonalBuyMoreError] = useAtom(personalBuyMoreErrorAtom);

  const { data, error, isLoading, mutate } = usePersonalBuyMoreService({
    wallet,
  });

  useEffect(() => {
    if (data) {
      setPersonalBuyMore(data.total_buymore_amount);
    }
  }, [data, setPersonalBuyMore]);

  useEffect(() => {
    setIsPersonalBuyMoreLoading(isLoading);
  }, [isLoading, setIsPersonalBuyMoreLoading]);

  useEffect(() => {
    if (error) {
      setPersonalBuyMoreError(error instanceof Error ? error : new Error(String(error)));
    } else {
      setPersonalBuyMoreError(null);
    }
  }, [error, setPersonalBuyMoreError]);

  const fetchPersonalBuyMore = useCallback(() => {
    return mutate(undefined, { revalidate: true });
  }, [mutate]);

  return {
    personalBuyMore,
    isPersonalBuyMoreLoading,
    personalBuyMoreError,
    fetchPersonalBuyMore,
  };
}
