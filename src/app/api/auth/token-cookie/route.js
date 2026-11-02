import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

const API_TOKEN_COOKIE = "sebak_api_token";
const API_TOKEN_MAX_AGE = 15 * 60;

export async function POST(request) {
  try {
    const auth = await getAuth();
    const { token } = await auth.api.getToken({ headers: request.headers });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = new NextResponse(null, { status: 204 });
    response.cookies.set(API_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: API_TOKEN_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(API_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
