import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import { User } from "@/lib/types";

interface Walk {
  _id: ObjectId;
}

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
    const users = db.collection<User>("accounts");
    const walks = db.collection<Walk>("walks");

    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const walkAttended = user.walkDetails.supportedWalk.includes(walkId);

    if (walkAttended) {
      try {
        const updatedUser = await users.updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { "walkDetails.supportedWalk": walkId } }
        );

        const updatedWalk = await walks.updateOne(
          { _id: new ObjectId(walkId) },
          { $pull: { supporters: { userId } } }
        );

        return NextResponse.json({
          success: true,
          message: `Walk removed from attended walks`,
          updatedUser,
          updatedWalk,
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "Error removing walk from attended", error },
          { status: 500 }
        );
      }
    } else {
      try {
        const attendedUser = await users.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { "walkDetails.supportedWalk": walkId } }
        );

        const updatedWalk = await walks.updateOne(
          { _id: new ObjectId(walkId) },
          { $push: { supporters: { userId, date: new Date().toISOString() } } }
        );

        return NextResponse.json({
          success: true,
          message: "Walk attended successfully",
          attendedUser,
          updatedWalk,
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "Error attending walk", error },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error", error }, { status: 500 });
  }
}
