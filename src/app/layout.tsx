import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { PropsWithChildren } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omni Stock",
  description: "Best Inventory System Ever",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-mono",
        jetbrainsMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors duration={2000} />
      </body>
    </html>
  );
}
