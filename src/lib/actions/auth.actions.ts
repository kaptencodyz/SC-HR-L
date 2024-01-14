"use server";
import * as z from "zod";
import {
  handleSchema,
  newPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../validators";
import { getUserByEmail } from "./user.actions";
import { db } from "@/db/db";
import {
  passwordResetToken,
  twoFactorConfirmation,
  twoFactorToken,
  users,
  verificationToken,
} from "@/db/schema";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
  getPasswordResetTokenByToken,
  getTwoFactorTokenByEmail,
  getVerificationTokenByToken,
} from "./tokens.actions";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "./mail.actions";
import { eq } from "drizzle-orm";
import { auth, signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function signUp(data: unknown) {
  try {
    const result = signUpSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.issues.map((issue) => issue) };
    }

    const { email, password } = result.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { validationError: "Email already in use!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      id: uuidv4(),
      email,
      password: hashedPassword,
      isTwoFactorEnabled: true,
    });

    console.log("user created");

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    return {
      success: "Email has been sent!",
    };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
}

export async function signIns(data: unknown) {
  const result = signInSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.issues.map((issue: any) => issue) };
  }

  const { email, password, code } = result.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { validationError: "Email does not exist" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    return { success: "Confirmation email sent" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const existingToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!existingToken) {
        return { error: "Invalid code" };
      }

      if (existingToken.token !== code) {
        return { error: "Invalid code" };
      }

      const hasExpired =
        new Date(existingToken.expires).getTime() < new Date().getTime();

      if (hasExpired) {
        return { error: "Code has expired" };
      }

      await db
        .delete(twoFactorToken)
        .where(eq(twoFactorToken.id, existingToken.id));

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db
          .delete(twoFactorConfirmation)
          .where(eq(twoFactorConfirmation.id, existingConfirmation.id));
      }

      await db.insert(twoFactorConfirmation).values({
        id: uuidv4(),
        userId: existingUser.id,
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail({
        email: twoFactorToken.email,
        token: twoFactorToken.token,
      });

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/" || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}

export async function verifyEmail(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    console.log("Token does not exist");
    return { error: "Invalid token" };
  }

  const hasExpired =
    new Date(existingToken.expires).getTime() < new Date().getTime();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exist" };
  }

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(users.email, existingToken.email));

  await db
    .delete(verificationToken)
    .where(eq(verificationToken.id, existingToken.id));
  console.log("Token deleted and success");

  return { success: "Email verified" };
}

export async function resetPassword(data: unknown) {
  try {
    const result = resetPasswordSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.issues.map((issue) => issue) };
    }

    const { email } = result.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "Email does not exist" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail({
      email: passwordResetToken.email,
      token: passwordResetToken.token,
    });

    return { success: "Password reset email sent" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function newPassword({
  data,
  token,
}: {
  data: unknown;
  token: string;
}) {
  try {
    const result = newPasswordSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.issues.map((issue) => issue) };
    }

    console.log("Result: ", result);

    const { password } = result.data;

    const existingToken = await getPasswordResetTokenByToken(token);
    console.log("Existing token: ", existingToken);
    if (!existingToken) {
      return { error: "Invalid token" };
    }

    const hasExpired =
      new Date(existingToken.expires).getTime() < new Date().getTime();

    if (hasExpired) {
      return { error: "Token has expired" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.email, existingToken.email));

    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.id, existingToken.id));
    console.log("Token deleted and success");
    return { success: "Password updated" };
  } catch (error) {}
}

export async function getTwoFactorConfirmationByUserId(userId: string) {
  try {
    const confirmation = await db
      .select()
      .from(twoFactorConfirmation)
      .where(eq(twoFactorConfirmation.userId, userId));

    return confirmation[0];
  } catch (error) {
    return null;
  }
}

export async function addHandle(d: unknown) {
  try {
    const result = handleSchema.safeParse(d);

    if (!result.success) {
      return {
        validationError: true,
      };
    }
    console.log("Result: ", result);

    const { handle } = result.data;

    const [{ data }, session] = await Promise.all([
      axios.get(
        `https://api.starcitizen-api.com/${process.env.STAR_CITIZEN_API_KEY}/v1/live/user/${handle}`
      ),
      auth(),
    ]);

    if (!session?.user) {
      return {
        unauthorized: true,
      };
    }
    console.log("Data: ", data);

    const fetchedHandle = data.data.profile.handle;
    console.log("Fetched handle: ", fetchedHandle);

    if (!fetchedHandle) {
      return {
        handleError: true,
      };
    }
    await db
      .update(users)
      .set({ handle: fetchedHandle })
      .where(eq(users.id, session.user.id));

    revalidatePath("/auth/enter-handle");
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: true,
    };
  }
}
