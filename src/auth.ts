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
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account }) {
      //if user is oAuth user, allow sign-in without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      //prevent sign-in if email is not verified
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = "Ijdoiasjoidja";
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
