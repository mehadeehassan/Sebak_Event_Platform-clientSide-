import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { db } from "@/lib/mongodb";

/* Server-side Better Auth configuration; never import this from client code. */
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
          picture: user.image,
        }),
      },
    }),
  ],
});
