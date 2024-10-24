import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { HttpStatusCode } from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("accounts");
    const { email, verificationCode } = body;

    // Email ve verificationCode'un gönderildiğini kontrol et
    if (!email || !verificationCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and verification code are required.",
        },
        { status: HttpStatusCode.BadRequest },
      );
    }

    // Kullanıcıyı bul
    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: HttpStatusCode.NotFound },
      );
    }

    // Doğrulama kodunun geçerlilik süresini kontrol et
    const currentTime = new Date();
    if (user.resetCodeExpiry < currentTime) {
      return NextResponse.json(
        { success: false, message: "Verification code expired." },
        { status: HttpStatusCode.BadRequest },
      );
    }

    // Doğrulama kodunu kontrol et
    if (user.resetCode !== verificationCode) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: HttpStatusCode.BadRequest },
      );
    }

    // Eğer kod doğruysa, doğrulama başarılı
    // Doğrulama sonrası resetCode ve resetCodeExpiry alanlarını temizle (isteğe bağlı)
    await collection.updateOne(
      { email },
      { $unset: { resetCode: "", resetCodeExpiry: "" } },
    );

    return NextResponse.json(
      { success: true, message: "Verification code is valid." },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error verifying the code." },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
