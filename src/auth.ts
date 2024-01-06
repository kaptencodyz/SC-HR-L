import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db/db";
import { signInSchema } from "./lib/validators";
import {
  getAccountByUserId,
  getUserByEmail,
  getUserById,
} from "./lib/actions/user.actions";
import bcrypt from "bcryptjs";
import { ExtendedUser } from "./lib/types";
import { getTwoFactorConfirmationByUserId } from "./lib/actions/auth.actions";
import { eq } from "drizzle-orm";
import { twoFactorConfirmation } from "./db/schema";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const result = signInSchema.safeParse(credentials);
        console.log(result);
        if (result.success) {
          const { email, password } = result.data;
          console.log(email, password);
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordIsValid = await bcrypt.compare(password, user.password);
          console.log(passwordIsValid);

          if (passwordIsValid) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/enter-handle",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        const user = session.user as ExtendedUser;
        user.id = token.sub;
        user.isOAuth = token.isOAuth as boolean;
        user.handle = token.handle as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      const existingUser = await getUserById(user.id);

      if (account?.provider !== "credentials") {
        if (existingUser?.isTwoFactorEnabled) {
          const confirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );

          if (!confirmation) return false;

          await db
            .delete(twoFactorConfirmation)
            .where(eq(twoFactorConfirmation.userId, existingUser.id));
        }
      } else {
        if (!existingUser?.emailVerified) return false;

        if (existingUser.isTwoFactorEnabled) {
          const confirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );

          if (!confirmation) return false;

          await db
            .delete(twoFactorConfirmation)
            .where(eq(twoFactorConfirmation.userId, existingUser.id));
        }
      }

      return true;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.handle = existingUser.handle;

      return token;
    },
  },
});
