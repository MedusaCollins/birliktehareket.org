import clientPromise from "@/lib/database/mongodb";
import { Collection, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

async function populateWalkDetails(
  walkIds: string[],
  walksCollection: Collection,
) {
  return await Promise.all(
    walkIds.map(async (walkId) => {
      const walk = await walksCollection.findOne({ _id: new ObjectId(walkId) });
      if (walk) {
        return {
          title: walk.title,
          description: walk.description,
          organizer: walk.organizer,
          images: walk.images,
          detail: walk.detail,
          moderators: walk.moderators,
          supporters: walk.supporters,
          updates: walk.updates,
          postInfo: walk.postInfo,
        };
      }
      return null;
    }),
  );
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Users");
    const walksCollection = db.collection("walks");
    const usersCollection = db.collection("accounts");

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const { walkDetails } = user;

    const updatedWalkDetails = {
      ownWalk: walkDetails.ownWalk?.length
        ? await populateWalkDetails(walkDetails.ownWalk, walksCollection)
        : [],
      savedWalk: walkDetails.savedWalk?.length
        ? await populateWalkDetails(walkDetails.savedWalk, walksCollection)
        : [],
      supportedWalk: walkDetails.supportedWalk?.length
        ? await populateWalkDetails(walkDetails.supportedWalk, walksCollection)
        : [],
    };

    const userInfo = {
      id: user._id,
      email: user.email,
      username: user.username,
      image: user.image,
      createdAt: user.createdAt,
      walkDetails: updatedWalkDetails,
    };

    return NextResponse.json({ success: true, userInfo });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
