"use server";

import { db } from "@/db/db";
import { accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));

    return user[0];
  } catch (error) {
    return null;
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId));

    return user[0];
  } catch (error) {
    return null;
  }
}

export async function getAccountByUserId(userId: string) {
  try {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId));

    return account[0];
  } catch (error) {
    return null;
  }
}
