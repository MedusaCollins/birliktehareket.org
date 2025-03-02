import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { HttpStatusCode } from "axios";
import { ObjectId } from "mongodb";
import { CreatePost, User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection<CreatePost>("walks");
    const users = db.collection<User>("accounts");

    const { title, description, organizer, images, detail, moderators, userId } = body;

    if (!title || !description || !organizer || !detail) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing." },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const newWalk: CreatePost = {
      title,
      description,
      organizer,
      images: images,
      detail: detail,
      moderators: moderators,
      supporters: [],
      updates: [],
      postInfo: {
        createdAt: new Date().toISOString(),
        createdBy: userId,
      },
    };

    const result = await collection.insertOne(newWalk);
    const walkId = result.insertedId.toString();

    if (result.insertedId) {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { "walkDetails.ownWalk": walkId } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        walk: { ...newWalk, id: result.insertedId },
        insertedId: result.insertedId,
      },
      { status: HttpStatusCode.Created }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error creating walk." },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
