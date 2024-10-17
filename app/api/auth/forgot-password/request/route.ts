import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { HttpStatusCode } from "axios";

const CODE_EXPIRY_TIME = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("accounts");
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email not found." },
        { status: HttpStatusCode.NotFound }
      );
    }

    const verificationCode = randomBytes(4).toString("hex"); // 8 karakterlik bir kod
    const expiryTime = new Date(Date.now() + CODE_EXPIRY_TIME);

    await collection.updateOne(
      { email },
      { $set: { resetCode: verificationCode, resetCodeExpiry: expiryTime } }
    );

    return NextResponse.json(
      { success: true, message: "Verification code sent to email." },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error sending verification code." },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
