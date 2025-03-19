"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorldAuth } from "next-world-auth/react";
import { useState, useCallback } from "react";

export function SignInForm() {
  const router = useRouter();
  const { isAuthenticated, session, signIn } = useWorldAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    await signIn().then(() => {
      setLoading(false);
    });

    console.log("Sign in with World ID clicked");
    // Redirect to chat after "sign in"
    router.push("/");
  }, [signIn, router]);

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome to MagicalAI</h1>
        <p className="text-zinc-400">
          Sign in below (we'll increase your message limits if you do 😊)
        </p>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleSignIn}
          className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          Sign in with World ID
        </button>
      </div>

      <p className="text-center text-sm text-zinc-400">
        By continuing, you agree to our{" "}
        <Link href="#" className="text-red-500 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-red-500 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
