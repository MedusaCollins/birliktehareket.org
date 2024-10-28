import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { HttpStatusCode } from "axios";
import { Resend } from "resend";
import PassResetTemplate from "@/emails/PassResetTemplate";
import { render } from "@react-email/render";

const CODE_EXPIRY_TIME = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("accounts");
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
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

    const verificationCode = randomBytes(4).toString("hex");
    const expiryTime = new Date(Date.now() + CODE_EXPIRY_TIME);

    await collection.updateOne(
      { email },
      { $set: { resetCode: verificationCode, resetCodeExpiry: expiryTime } },
    );

    // TODO: Email Sending need to be rate limited.

    const resend = new Resend(process.env.RESEND_API_KEY);

    const resetTemplate = await render(PassResetTemplate({verificationCode:verificationCode}));

    await resend.emails.send({
      from: "Birlikte Hareket <noreply@birliktehareket.org>",
      to: [`${email}`],
      subject: "Birlikte Hareket | Password Reset Code",
      html: resetTemplate,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Verification code sent to email. Dont forget to check your spam folder.",
      },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error sending verification code." },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
