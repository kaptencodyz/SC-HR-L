"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPasswordSchema } from "@/lib/validators";
import { resetPassword } from "@/lib/actions/auth.actions";

export default function ResetPasswordPage() {
  const [successState, setSuccessState] = useState(false);

  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    const res = await resetPassword(data);

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
        <button className=" text-white px-2 py-2" type="submit">Reset password</button>
        {isSubmitting && <p>Submitting...</p>}
      </form>
      {successState && (
        <div className=" text-white">
          <h1>Success</h1>
        </div>
      )}
    </main>
  );
}
