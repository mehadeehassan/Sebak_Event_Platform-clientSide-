import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_BASE = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_TOKEN_COOKIE = "sebak_api_token";
const API_TOKEN_MAX_AGE = 15 * 60;
const BETTER_AUTH_SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth-session_token",
  "__Secure-better-auth-session_token",
];

async function issueApiToken(request) {
  const result = await auth.api.getToken({ headers: request.headers });
  return result?.token || null;
}

function buildUpstreamUrl(path, search) {
  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  const url = new URL(encodedPath, `${API_BASE.replace(/\/+$/, "")}/`);
  url.search = search;
  return url;
}

function isPublicRead(method, path) {
  return (
    method === "GET" &&
    path[0] === "events" &&
    (path.length === 1 || (path.length === 2 && path[1] !== "my"))
  );
}

async function callBackend(request, url, token, body) {
  const headers = new Headers(request.headers);
  headers.delete("cookie");
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("accept-encoding");
  if (token) headers.set("authorization", `Bearer ${token}`);
  else headers.delete("authorization");

  return fetch(url, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  });
}

function makeResponse(upstream, tokenToStore, clearToken = false) {
  const headers = new Headers(upstream.headers);
  for (const name of [
    "connection",
    "content-encoding",
    "content-length",
    "keep-alive",
    "set-cookie",
    "transfer-encoding",
  ]) {
    headers.delete(name);
  }

  const noBody = [204, 205, 304].includes(upstream.status);
  const response = new NextResponse(noBody ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });

  if (clearToken) {
    response.cookies.set(API_TOKEN_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } else if (tokenToStore) {
    response.cookies.set(API_TOKEN_COOKIE, tokenToStore, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: API_TOKEN_MAX_AGE,
    });
  }

  return response;
}

async function handle(request, context) {
  const { path = [] } = await context.params;
  if (path.some((segment) => segment === "." || segment === "..")) {
    return NextResponse.json({ error: "Invalid API path" }, { status: 400 });
  }

  const url = buildUpstreamUrl(path, new URL(request.url).search);
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;
  let token = request.cookies.get(API_TOKEN_COOKIE)?.value || null;
  let tokenToStore = null;

  const hasAuthSession = BETTER_AUTH_SESSION_COOKIES.some((name) => request.cookies.has(name));
  if (!token && hasAuthSession) {
    try {
      token = await issueApiToken(request);
      tokenToStore = token;
    } catch {
      token = null;
    }
  }

  if (!token && !isPublicRead(request.method, path)) {
    return makeResponse(
      new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
      null,
      true
    );
  }

  try {
    let upstream = await callBackend(request, url, token, body);

    /* Renew an expired API JWT once, using the Better Auth session cookie. */
    if (upstream.status === 401 && token) {
      const freshToken = await issueApiToken(request).catch(() => null);
      if (freshToken && freshToken !== token) {
        token = freshToken;
        tokenToStore = freshToken;
        upstream = await callBackend(request, url, token, body);
      }
    }

    return makeResponse(upstream, tokenToStore, Boolean(token && upstream.status === 401));
  } catch {
    return NextResponse.json({ error: "Backend service is unavailable" }, { status: 502 });
  }
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
