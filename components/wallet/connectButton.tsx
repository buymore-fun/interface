"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLogin, PrivyProvider, getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import Image from "next/image";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { formatAddress } from "@/lib/utils/format-address";
import { getPersonalBuyMore } from "@/hooks/services";
import config from "@/config";

async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}

export default function ConnectButton() {
  const { login } = useLogin({
    // onComplete: () => router.push("/"),
  });
  const [verifyResult, setVerifyResult] = useState();
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const [personalBuyMore, setPersonalBuyMore] = useState<string>("0");
  const getPersonalBuyMoreData = async () => {
    const personalBuyMore = await getPersonalBuyMore({ wallet: config.defaultPool as string });
    setPersonalBuyMore(personalBuyMore.total_buymore_amount);
    console.log("🚀 ~ getPersonalBuyMore ~ personalBuyMore:", personalBuyMore);
  };
  console.log("=====", user);

  useEffect(() => {
    if (user) {
      getPersonalBuyMoreData();
    }
  }, [user]);

  return (
    <>
      {ready && authenticated && (
        <>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="px-3 rounded-md border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {formatAddress(user?.wallet?.address || "")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuItem> */}
                <div className="flex flex-col gap-1 text-sm px-3 pt-2">
                  <span className="text-muted-foreground">Total Buymore </span>
                  <span className="text-white">$ {personalBuyMore}</span>
                </div>
                {/* </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full text-white flex justify-between px-1"
                  >
                    <Wallet className="text-muted-foreground size-3" />
                    Disconnect
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              onClick={login}
            >
              Connect
            </Button>
          )}
        </>
      )}
    </>
  );
}
