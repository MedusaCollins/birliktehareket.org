import { pbkdf2Sync, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { HttpStatusCode } from "axios";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("accounts");
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, verification code and new password are required.",
        },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email not found." },
        { status: HttpStatusCode.NotFound },
      );
    }

    if (user.resetCodeExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: "Verification code expired." },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = pbkdf2Sync(
      newPassword,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
    ).toString("hex");

    await collection.updateOne(
      { email },
      {
        $set: {
          password: `${salt}:${hashedPassword}`,
          resetCode: null,
          resetCodeExpiry: null,
        },
      },
    );

    return NextResponse.json(
      { success: true, message: "Password successfully reset." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error resetting password." },
      { status: 500 },
    );
  }
}
