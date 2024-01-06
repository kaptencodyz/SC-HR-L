
import { auth } from "@/auth";
import SignOutBtn from "@/components/SignOutBtn";
import React from "react";

export default async function Protected() {
  const session = await auth();

  return (
    <div className="h-screen">
      <h1>Protected Page</h1>
      <p>{JSON.stringify(session?.user)}</p>
      <SignOutBtn />
    </div>
  );
}
