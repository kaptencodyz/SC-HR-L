"use client";

import { useMutation } from "@tanstack/react-query";
import { sign } from "crypto";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function SignInTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/testPage");
    }
  }, [session.status, router]);

  const {
    mutate: signUp,
    isLoading: signUpLoading,
    data: signUpRes,
    error,
    status,
  } = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch("/api/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const responseData = await response.json();

      return responseData;
    },
  });

  router;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signUp({ email, password });
  }

  if (status === "success") {
    const data = { email, password };
    signIn("credentials", { ...data, redirect: false });
    /*     router.push("/testPage");
     */
  }

  return (
    <>
      {isMounted && (
        <div>
          <form className="text-black" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="text-white" type="submit">
              Submit
            </button>
          </form>
          <button className="text-white" onClick={() => signOut()}>
            Sign out
          </button>
          <div>{session.status}</div>
          <div>{`${session.data?.user?.email}`}</div>
          <div>{`${session.data?.user?.name}`}</div>
        </div>
      )}
    </>
  );
}
