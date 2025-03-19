// components/ErudaClient.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically load the Eruda component with ssr disabled
// Dynamically import the ErudaProvider
const ErudaProvider = dynamic(
  () => import("../Eruda").then((mod) => mod.ErudaProvider),
  {
    ssr: false, // Disable SSR for this component
  }
);

export function ErudaClient({ children }: { children: React.ReactNode }) {
  return <ErudaProvider>{children}</ErudaProvider>;
}
