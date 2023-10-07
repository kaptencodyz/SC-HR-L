"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInTest() {
  const session = useSession();

  return (
    <div>
      <button
        className="px-4 py-2 rounded-md bg-contrast"
        onClick={() => signIn("google")}
      >
        Sign in
      </button>
      <div>{session.status}</div>
      <div>{`${session.data?.user?.email}`}</div>
      <div>{`${session.data?.user?.name}`}</div>
    </div>
  );
}
