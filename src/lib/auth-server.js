import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { db } from "./mongodb";

/* This is the auth server of the app, served at /api/auth:
   email + password sign in, Google social login and the jwt plugin that
   gives /api/auth/token the token every private API request carries. */
export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    /* The register form wants an uppercase + lowercase + 6 characters —
       keep the server rule consistent with it. */
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
        /* The events server reads who created and joined from these claims,
           the sub claim already carries the user id. */
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
          picture: user.image,
        }),
      },
    }),
  ],
});
