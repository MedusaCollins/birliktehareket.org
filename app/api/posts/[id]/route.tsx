import { NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("walks");

    const post = await collection.findOne({ _id: new ObjectId(params.id) });

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found." });
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error.",
    });
  }
}
