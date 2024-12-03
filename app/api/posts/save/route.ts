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

    const walkExists = user.walkDetails.savedWalk.includes(walkId);

    try {
      if (walkExists) {
        await collection.updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { "walkDetails.savedWalk": walkId } }
        );

        return NextResponse.json({
          success: true,
          message: "Walk removed from saved walks,",
        });
      }

      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { "walkDetails.savedWalk": walkId } }
      );

      return NextResponse.json({
        success: true,
        message: "Walk saved successfully",
        walk: walkId,
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Error saving walk", error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error", error }, { status: 500 });
  }
}
