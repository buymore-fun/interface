"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLogin, usePrivy, useLogout } from "@privy-io/react-auth";
import { useEffect, useRef } from "react";
import { formatAddress } from "@/lib/utils/format-address";
import toast from "react-hot-toast";
import { usePersonalBuyMore } from "@/hooks/use-personal-buymore";
import { Wallet } from "lucide-react";

export default function ConnectPrivyButton() {
  const { login } = useLogin();
  const { ready, authenticated, user } = usePrivy();
  const { personalBuyMore, isPersonalBuyMoreLoading, fetchPersonalBuyMore } = usePersonalBuyMore(
    user?.wallet?.address as string
  );

  const disableLogout = !ready || (ready && !authenticated);

  useEffect(() => {
    if (user) {
      console.log("🚀 ~ useEffect ~ user:", user);
      fetchPersonalBuyMore();
    }
  }, [user]);

  const { logout } = useLogout({
    onSuccess: () => {
      console.log("User successfully logged out");
    },
  });

  if (authenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="px-3 rounded-md border-primary hover:bg-primary hover:text-primary-foreground"
          >
            {formatAddress(user?.wallet?.address || "")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex flex-col gap-1 text-sm px-3 pt-2">
            <span className="text-muted-foreground">Total Buymore </span>
            <span className="text-white">${personalBuyMore}</span>
          </div>
          <DropdownMenuItem>
            <Button
              variant="ghost"
              onClick={logout}
              disabled={disableLogout}
              className="w-full text-white flex justify-between px-1"
            >
              <Wallet className="text-muted-foreground size-3" />
              Disconnect
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="outline"
      className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
      onClick={() => {
        login({
          loginMethods: ["wallet"],
          walletChainType: "solana-only",
          disableSignup: false,
        });
      }}
    >
      Connect
    </Button>
  );
}
