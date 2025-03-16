import { Suspense } from "react";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MagicalSparkles } from "@/components/MagicalSparkles";
import { ChatInterface } from "@/components/ChatInterface";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const chatId = (await searchParams).id;

  return (
    <main className="flex h-screen bg-black">
      <Suspense fallback={<LoadingIndicator />}>
        <>
          <MagicalSparkles />
          <ChatInterface chatId={chatId} />
        </>
      </Suspense>
    </main>
  );
}
