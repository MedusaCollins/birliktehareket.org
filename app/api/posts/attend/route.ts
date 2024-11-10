import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, walkId } = body;

    if (!userId || !walkId) {
      return NextResponse.json(
        { success: false, message: "User ID and Walk ID are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection("accounts");

    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const walkAttended = user.walkDetails.supportedWalk.includes(walkId);

    if (walkAttended) {
      const updatedUser = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { "walkDetails.supportedWalk": walkId } }
      );
      return NextResponse.json({
        success: true,
        message: `Walk removed from attended walks, ${updatedUser}`,
      });
    } else {
      const updatedUser = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { "walkDetails.supportedWalk": walkId } }
      );

      if (updatedUser.modifiedCount === 0) {
        return NextResponse.json({
          success: false,
          message: "Error attending walk",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Walk attended successfully",
        walk: walkId,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error attending walk", error },
      { status: 500 }
    );
  }
}
