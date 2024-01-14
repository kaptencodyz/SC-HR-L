"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleSchema, signInSchema } from "@/lib/validators";
import { addHandle } from "@/lib/actions/auth.actions";

export default function EnterHandle() {
  const [successState, setSuccessState] = useState(false);

  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof handleSchema>>({
    resolver: zodResolver(handleSchema),
    defaultValues: {
      handle: "",
    },
  });

  async function onSubmit(data: z.infer<typeof handleSchema>) {
    const { unauthorized, success, error, handleError } = await addHandle(data);

    switch (true) {
      case success:
        setSuccessState(true);
        break;
      case handleError:
        setError("handle", { message: error });
        break;
    }
  }

  return (
    <main className=" h-screen">
      <form className=" text-black max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label className="text-white">Handle</label>
          <input {...register("handle")} />
          {errors.handle && (
            <p className=" text-red-500">{errors.handle.message}</p>
          )}
        </div>
        <button className=" text-white px-2 py-2" type="submit">
          Add Handle
        </button>
        {successState && (
          <p className=" text-green-500">Handle added successfully!</p>
        )}
      </form>
    </main>
  );
}
