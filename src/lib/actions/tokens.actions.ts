"use server";

import { db } from "@/db/db";
import { passwordResetToken, verificationToken } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

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
