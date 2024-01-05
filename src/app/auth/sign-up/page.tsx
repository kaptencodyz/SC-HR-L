"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/lib/validators";
import { signUp } from "@/lib/actions/auth.actions";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [successState, setSuccessState] = useState(false);
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    const { error, success, validationError } = await signUp(data);

    if (validationError) {
      console.log(validationError);
    } else {
      reset();
      setSuccessState(true);
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
      <button onClick={() => signIn("google")}>Google</button>
    </main>
  );
}
