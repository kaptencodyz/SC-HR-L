"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendTwoFactorTokenEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
}

export async function sendPasswordResetEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const resetLink = `${domain}/auth/change-password?token=${token}`;

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  console.log(error);
}

export async function sendVerificationEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const confirmLink = `${domain}/auth/verify-email?token=${token}`;
  console.log("Sending email");
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
}
