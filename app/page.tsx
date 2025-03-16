import { Suspense } from "react"
import { LoadingIndicator } from "@/components/LoadingIndicator"
import { MagicalSparkles } from "@/components/MagicalSparkles"
import { ChatInterface } from "@/components/ChatInterface"






export default function Home() {
  return (
    <main className="flex h-screen bg-black">
      <Suspense fallback={<LoadingIndicator />}>
        <>
          <MagicalSparkles />
          <ChatInterface chatId="default" />
        </>
      </Suspense>
    </main>
  )
}

