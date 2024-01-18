"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newPasswordSchema } from "@/lib/validators";
import { newPassword } from "@/lib/actions/auth.actions";
import { useSearchParams } from "next/navigation";

export default function ChangePasswordPage() {
  const [successState, setSuccessState] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof newPasswordSchema>) {
    if (token) {
      const res = await newPassword({ data, token });

      if (res?.error) {
        console.log(res.error);
      }

      if (res?.success) {
        setSuccessState(true);
        reset();
      }
    }
  }

  return (
    <main className=" h-screen">
      <form className=" text-black max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label className="text-white">New password</label>
          <input {...register("password")} type="password" />
          {errors.password && (
            <p className=" text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-white">Confirm new password</label>
          <input {...register("confirmPassword")} type="password" />
          {errors.password && (
            <p className=" text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button className=" text-white px-2 py-2" type="submit">
          Submit
        </button>
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
