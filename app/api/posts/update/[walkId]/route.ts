import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { HttpStatusCode } from "axios";
import { ObjectId } from "mongodb";
import { Post, User } from "@/lib/types";

export async function PATCH(request: NextRequest, { params }: { params: { walkId: string } }) {
  try {
    const walkId = params.walkId;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("test");
    const usersCollection = db.collection<User>("test");
    const walksCollection = db.collection<Post>("walks");

    const {
      userId,
      title,
      description,
      detail,
      removedModerators,
      addedModerators,
      updateTitle,
      updateMessage,
    } = body;

    if (!walkId || !userId) {
      return NextResponse.json(
        { success: false, message: "Walk ID and User ID are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const walk = await walksCollection.findOne({ _id: new ObjectId(walkId) });
    if (!walk) {
      console.log(walkId);
      return NextResponse.json({ success: false, message: "Walk not found" }, { status: 404 });
    }

    if (
      walk.postInfo?.createdBy !== userId &&
      !walk.moderators?.some((mod) => mod.userId.toString() === userId)
    ) {
      return NextResponse.json(
        { success: false, message: "User is not authorized to update this walk" },
        { status: 403 }
      );
    }

    const updatedWalk: Post = {
      ...walk,
      title: title || walk.title,
      description: description || walk.description,
      detail: {
        ...walk.detail,
        ...detail,
      },
      // images: images || walk.images, // When we have image upload functionality we can work on this
      moderators: walk.moderators
        .filter((mod) => !removedModerators.includes(mod.userId))
        .concat(
          addedModerators.map((userId: string) => ({ userId, date: new Date().toISOString() }))
        ),
      updates: [
        ...walk.updates,
        {
          date: new Date().toISOString(),
          title: updateTitle,
          message: updateMessage,
          images: [],
          userId,
        },
      ],
    };

    const result = await walksCollection.updateOne(
      { _id: new ObjectId(walkId) },
      { $set: updatedWalk }
    );

    if (result.modifiedCount < 2) {
      return NextResponse.json(
        { success: false, message: "None of the values have been changed." },
        { status: HttpStatusCode.BadRequest }
      );
    }

    return NextResponse.json(
      { success: true, message: "Walk updated successfully", updatedWalk },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating walk", error },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
