import clientPromise from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("accounts");

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      userInfo: {
        image: user.image,
        username: user.username,
        email: user.email,
        id: user._id,
        createdAt: user.createdAt,
        walkDetails: user.walkDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
