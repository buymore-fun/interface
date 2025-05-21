"use client";

import { useDashboardIndex } from "@/hooks/services";
import { DEFAULT_OUTPUT_TOKEN, solChangeToToken } from "@/lib/constants";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const router = useRouter();

  const { data, isLoading } = useDashboardIndex({
    input_token: solChangeToToken("sol"),
    output_token: solChangeToToken(DEFAULT_OUTPUT_TOKEN),
    tt: "all",
  });

  const handleSwap = () => {
    router.push(
      `/swap?inputMint=${solChangeToToken("sol")}&outputMint=${solChangeToToken(DEFAULT_OUTPUT_TOKEN)}`
    );
  };

  return (
    <div className="relative w-full">
      <div className="min-h-[calc(100vh-200px)] text-white relative font-righteous overflow-scroll">
        <div className="container mx-auto px-4 md:px-6 py-6 relative z-10">
          <div className="flex flex-col gap-8 md:gap-12 mx-4 md:mx-8">
            <div className=" text-center">
              <div className="relative w-full md:w-[640px] h-[180px] md:h-[280px] mx-auto">
                <video
                  src="/logo.mp4"
                  autoPlay
                  muted
                  // loop
                  playsInline
                  className="absolute w-full h-full object-cover"
                />
              </div>
              <img
                src="/home-title.png"
                alt="title"
                className="object-cover w-full max-w-3xl mx-auto"
              />
              <p className="text-base sm:text-lg lg:text-2xl xl:text-3xl max-w-4xl text-white text-shadow-sm text-shadow-primary font-semibold leading-relaxed lg:leading-[3rem] xl:leading-[4rem] tracking-wider md:tracking-widest mx-auto mt-4">
                A Community driven hybrid trading DEX that aggregates the liquidity of AMM and
                Orderbook.
              </p>
            </div>

            {/* <Button
              onClick={handleSwap}
              className="text-base md:text-lg rounded-full mx-auto px-12 md:px-20 py-6 md:py-8 transition-all hover:scale-105"
              variant="default"
              size="lg"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Buymore
            </Button> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 justify-items-center md:justify-items-start ">
              <div className="flex flex-col gap-2 w-fit">
                <span className="text-muted-foreground text-xl md:text-2xl">Total volume</span>
                <CountUp start={1000000} end={999766} delay={0}>
                  {({ countUpRef }) => (
                    <span
                      className="font-semibold text-2xl md:text-[28px] font-digital before:content-['$'] bg-primary p-2 rounded-md"
                      ref={countUpRef}
                    ></span>
                  )}
                </CountUp>
              </div>
              <div className="flex flex-col gap-2 w-fit">
                <span className="text-muted-foreground text-xl md:text-2xl">Traders</span>
                <CountUp start={1000000} end={999968} delay={0}>
                  {({ countUpRef }) => (
                    <span
                      className="font-semibold text-2xl md:text-[28px] font-digital bg-primary p-2 rounded-md"
                      ref={countUpRef}
                    ></span>
                  )}
                </CountUp>
              </div>

              <div className="flex flex-col gap-2 w-fit">
                <span className="text-muted-foreground text-xl md:text-2xl">Orders</span>
                <CountUp start={1000000} end={999888} delay={0}>
                  {({ countUpRef }) => (
                    <span
                      className="font-semibold text-2xl md:text-[28px] font-digital bg-primary p-2 rounded-md"
                      ref={countUpRef}
                    ></span>
                  )}
                </CountUp>
              </div>

              <div className="flex flex-col gap-2 w-fit">
                <span className="text-muted-foreground text-xl md:text-2xl">Value of Buymore</span>
                <CountUp start={1000000000} end={999999666} delay={0}>
                  {({ countUpRef }) => (
                    <span
                      className="font-semibold text-2xl md:text-[28px] font-digital before:content-['$'] bg-primary p-2 rounded-md"
                      ref={countUpRef}
                    ></span>
                  )}
                </CountUp>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative text-white text-sm w-full pb-4 mt-8">
        <Separator className="w-full max-w-none mx-auto h-[0.5px] mb-4" />
        <div className="w-full max-w-6xl mx-auto px-4 py-2 font-righteous">
          <span>© Buymore.fun</span>
        </div>
      </div>
    </div>
  );
}
