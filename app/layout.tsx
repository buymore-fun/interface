import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Righteous } from "next/font/google";
import "./globals.css";
import { Topbar } from "@/components/topbar";
import { ConnectWalletModal } from "@/components/connect-wallet-modal";
import { SolanaProvider } from "@/app/solana-provider";
import { ReactQueryProvider } from "@/app/react-query-provider";
import { Toaster } from "react-hot-toast";
import { GlobalInit } from "@/components/global-init";
import localFont from "next/font/local";
import { PrivyProviderWrapper } from "@/app/privy-provider";
import config from "@/config";
import { PrivyProvider } from "@privy-io/react-auth";
// Local digital font
const digital = localFont({
  src: "../public/fonts/DigitalNumbers-Regular.ttf",
  variable: "--font-digital",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buymore",
  description: "Buy more",
};

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${righteous.variable} ${digital.variable} antialiased`}>
        <ReactQueryProvider>
          {/* <SolanaProvider> */}
          <PrivyProviderWrapper>
            {/* todo after test open */}
            {/* <GlobalInit /> */}
            <div className="flex min-h-screen w-screen flex-col">
              {/* todo after test open */}
              {/* <Topbar /> */}
              <div className="flex flex-1 flex-col p-4 overflow-y-auto hide-scrollbar">
                <div className="w-full max-w-6xl mx-auto">{children}</div>
              </div>
              {/* todo after test open */}
              {/* <ConnectWalletModal /> */}
              <Toaster position="bottom-right" />
            </div>
          </PrivyProviderWrapper>
          {/* </SolanaProvider> */}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
