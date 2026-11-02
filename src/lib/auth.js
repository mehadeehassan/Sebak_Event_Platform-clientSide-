import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { getDb } from "@/lib/mongodb";

let authPromise;

/** Initialize Better Auth and MongoDB on demand, never while collecting build data. */
export function getAuth() {
  if (!authPromise) {
    authPromise = getDb()
      .then((db) =>
        betterAuth({
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
        })
      )
      .catch((error) => {
        authPromise = undefined;
        throw error;
      });
  }

  return authPromise;
}
