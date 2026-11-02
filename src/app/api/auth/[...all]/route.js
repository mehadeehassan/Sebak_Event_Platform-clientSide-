import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

async function handle(request, context) {
  const auth = await getAuth();
  const handlers = toNextJsHandler(auth.handler);
  return handlers[request.method](request, context);
}

export const GET = handle;
export const POST = handle;
