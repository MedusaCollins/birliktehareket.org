import { pbkdf2Sync, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { HttpStatusCode } from "axios";

const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("accounts");
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, email and password are required.",
        },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const existingUser = await collection.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username or email already exists." },
        { status: HttpStatusCode.Conflict },
      );
    }

    const salt = randomBytes(SALT_LENGTH).toString("hex");
    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
    ).toString("hex");

    const newAccount = {
      username,
      email,
      password: `${salt}:${hashedPassword}`,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newAccount);
    return NextResponse.json(
      {
        success: true,
        account: { username, email },
        insertedId: result.insertedId,
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error creating account." },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
