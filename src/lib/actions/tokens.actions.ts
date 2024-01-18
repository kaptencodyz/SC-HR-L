"use server";

import { db } from "@/db/db";
import {
  passwordResetToken,
  twoFactorToken,
  verificationToken,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export async function getVerificationTokenByEmail(email: string) {
  try {
    const token = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email));

    return token[0];
  } catch (error) {
    return null;
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    const existingToken = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token));

    return existingToken[0];
  } catch {
    return null;
  }
}

export async function getPasswordResetTokenByToken(token: string) {
  try {
    const existingToken = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token));

    return existingToken[0];
  } catch {
    return null;
  }
}

export async function getTwoFactorTokenByToken(token: string) {
  try {
    const existingToken = await db
      .select()
      .from(twoFactorToken)
      .where(eq(twoFactorToken.token, token));

    return existingToken[0];
  } catch (error) {
    return null;
  }
}

export async function getTwoFactorTokenByEmail(email: string) {
  try {
    const existingToken = await db
      .select()
      .from(twoFactorToken)
      .where(eq(twoFactorToken.email, email));

    return existingToken[0];
  } catch (error) {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const token = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email));

    return token[0];
  } catch (error) {
    return null;
  }
}

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 2000);
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.id, existingToken.id));
  }

  console.log("Token: ", token);

  await db.insert(verificationToken).values({
    id: uuidv4(),
    email,
    token,
    expires,
  });

  console.log("inserted token");

  const newVerificationToken = await db
    .select()
    .from(verificationToken)
    .where(eq(verificationToken.email, email));

  console.log("New verification token: ", newVerificationToken[0].token);

  return newVerificationToken[0];
}

export async function generatePasswordResetToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 2000);
  //TODO: Later change to 15 minutes
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.id, existingToken.id));
  }

  await db.insert(passwordResetToken).values({
    id: uuidv4(),
    email,
    token,
    expires,
  });

  const newPasswordResetToken = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.email, email));

  return newPasswordResetToken[0];
}

export async function generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 2000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(twoFactorToken)
      .where(eq(twoFactorToken.id, existingToken.id));
  }

  await db
    .insert(twoFactorToken)
    .values({ id: uuidv4(), email, token, expires });

  const newTwoFactorToken = await db
    .select()
    .from(twoFactorToken)
    .where(eq(twoFactorToken.email, email));

  return newTwoFactorToken[0];
}
