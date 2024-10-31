import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = cookies().get("session-token");

  return NextResponse.json({ isLoggedIn: !!token });
}
