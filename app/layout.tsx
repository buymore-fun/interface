import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Topbar } from "@/components/topbar";
import { ConnectWalletModal } from "@/components/connect-wallet-modal";
import { Providers } from "@/components/providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen w-screen flex-col">
            <Topbar />
            <div className="flex flex-1 flex-col p-4 overflow-y-auto">
              <div className="w-full max-w-6xl mx-auto">{children}</div>
            </div>
            <ConnectWalletModal />
          </div>
        </Providers>
      </body>
    </html>
  );
}
