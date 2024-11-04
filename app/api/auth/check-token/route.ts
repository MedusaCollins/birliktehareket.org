import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import getUserEmail from "@/lib/helpers/getUserEmail";

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export async function GET() {
  const token = cookies().get("session-token");

  if (!token) {
    return NextResponse.json({ isLoggedIn: false });
  }

  try {
    const { email } = jwt.verify(token.value, SECRET_KEY) as { email: string };

    const verifyEmail = await getUserEmail(email);
    if (!verifyEmail) {
      return NextResponse.json({ isLoggedIn: false });
    }

    return NextResponse.json({ isLoggedIn: true });
  } catch (e) {
    return NextResponse.json({
      isLoggedIn: false,
      error: e || "An unknown error occurred.",
    });
  }
}
