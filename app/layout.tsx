import type React from "react";
import "./globals.css";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { WorldAuthProvider } from "next-world-auth/react";
import { ErudaClient } from "@/components/Eruda/ErudaClient";
import { Rubik } from "next/font/google";
// import "@worldcoin/mini-apps-ui-kit-react/styles.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MagicalAI - Chat",
  description: "A magical AI chat experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <WorldAuthProvider>
        <body className={rubik.className}>
          <ErudaClient>
            <ThemeProvider attribute="class" defaultTheme="dark">
              {children}
            </ThemeProvider>
          </ErudaClient>
        </body>
      </WorldAuthProvider>
    </html>
  );
}

import "./globals.css";
