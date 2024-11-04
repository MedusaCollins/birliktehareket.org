import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_KEY = process.env.JWT_SECRET_KEY;
const SECRET_KEY = new TextEncoder().encode(JWT_KEY);

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (e) {
    throw new Error("Invalid token");
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    await verifyJWT(token);
  } catch (e) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
