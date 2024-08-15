import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./src/db/db";
import { accounts, sessions, users, verificationTokens } from "./src/db/schema";
import { NextAuthConfig } from "next-auth";

import { config } from "dotenv";
config({ path: ".env.local" });

export default {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GitHub({
      clientId: "Ov23liwb58CLQYRcSlUk",
      clientSecret: "216f91863a6b5bd117755b0af47504f3fd4adea0",
    }),
    
  ],

  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
