import clientPromise from "@/lib/database/mongodb";
import { NextResponse } from "next/server";

export default async function getUserEmail(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("accounts");

    const user = await collection.findOne({ email });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}
