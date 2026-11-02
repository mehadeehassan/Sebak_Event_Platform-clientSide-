import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth-server";

/* Every BetterAuth route (sign-in, get-session, token, jwks, Google callback)
   lives on this app at /api/auth. */
export const { GET, POST } = toNextJsHandler(auth.handler);
