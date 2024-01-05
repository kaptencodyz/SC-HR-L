"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/actions/auth.actions";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const token = searchParams.get("token");
  const router = useRouter();

  if (!token) {
    throw new Error("No token provided");
  }

  async function confirmEmail() {
    if (token) {
      const { success, error } = await verifyEmail(token);
      if (success) {
        router.push("/auth/sign-in");
      } else {
        setError("Error verifying email");
      }
    }
  }

  return (
    <form action={confirmEmail}>
      <button type="submit" className="bg-white text-black px-4 py-2">
        Click here to verify your email
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
