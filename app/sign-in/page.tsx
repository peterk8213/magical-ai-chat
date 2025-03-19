"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SignInForm } from "@/components/SignInForm";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="flex h-14 items-center gap-4 border-b border-zinc-800 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Chat</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <SignInForm />
      </div>
    </div>
  );
}
