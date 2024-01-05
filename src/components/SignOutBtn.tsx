"use client";

import { signOut } from "next-auth/react";

export default function SignOutBtn() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
