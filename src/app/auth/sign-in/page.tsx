"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/lib/validators";
import { signIns } from "@/lib/actions/auth.actions";
import { signOut } from "next-auth/react";

export default function SignInPage() {
  const [successState, setSuccessState] = useState(false);

  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const res = await signIns(data);

    if (res?.error) {
      console.log(res.error);
    }

    if (res?.success) {
      setSuccessState(true);
      reset();
    }

    if (res?.error) {
      console.log(res.error);
    }
  }

  return (
    <main className=" h-screen">
      <form className=" text-black max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label className="text-white">Email</label>
          <input {...register("email")} type="text" />
          {errors.email && (
            <p className=" text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-white">Password</label>
          <input {...register("password")} type="password" />
          {errors.password && (
            <p className=" text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button className=" text-white px-2 py-2" type="submit">
          Sign Up
        </button>
        {isSubmitting && <p>Submitting...</p>}
      </form>
      {successState && (
        <div className=" text-white">
          <h1>Success</h1>
          <p>Check your email for a confirmation link</p>
        </div>
      )}
      <button onClick={() => signOut()}>Sign out</button>
    </main>
  );
}
