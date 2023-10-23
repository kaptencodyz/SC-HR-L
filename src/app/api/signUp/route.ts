import * as argon2 from "argon2";
import { db } from "@/db/db";
import { NextResponse } from "next/server";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { signIn } from "next-auth/react";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    //check if user exists
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length > 0) {
      return new NextResponse("User already exists", { status: 400 });
    }

    //hash password
    const hashedPassword = await argon2.hash(password);

    const newUser = await db.insert(users).values({
      id: nanoid(),
      email: email,
      password: hashedPassword,
      handle: "mr tratt",
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
