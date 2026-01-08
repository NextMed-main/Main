import { Toaster } from "@/components/ui/sonner";
import { MidnightWalletProvider } from "@/components/wallet/midnight-wallet-provider";
import { WalletProvider } from "@/components/wallet/wallet-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextMed - AI Medical Data Platform",
  description:
    "Confidential medical data platform powered by Midnight ZK technology",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NextMed",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`}>
        <WalletProvider>
          <MidnightWalletProvider>
            {children}
            <Toaster />
          </MidnightWalletProvider>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}

