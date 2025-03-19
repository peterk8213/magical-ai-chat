"use client";

import { Suspense } from "react";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MagicalSparkles } from "@/components/MagicalSparkles";
import { ChatInterface } from "@/components/ChatInterface";

import { useWorldAuth } from "next-world-auth/react";

export default function Home() {
  const { isInstalled, isAuthenticated, session, signIn, signOut } =
    useWorldAuth();
  console.log(session);
  return (
    <main className="flex h-screen bg-black">
      <Suspense fallback={<LoadingIndicator />}>
        <>
          <MagicalSparkles />
          <ChatInterface chatId="default" />
        </>
      </Suspense>
    </main>
  );
}
