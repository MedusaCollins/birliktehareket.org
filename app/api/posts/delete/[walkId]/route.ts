import { ObjectId } from "mongodb";
import clientPromise from "@/lib/database/mongodb";
import { User, Post } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { walkId: string } }) {
  try {
    const walkId = params.walkId;
    const walkObjectId = new ObjectId(walkId);

    const client = await clientPromise;
    const db = client.db("Users");
    const usersCollection = db.collection<User>("accounts");
    const walksCollection = db.collection<Post>("walks");

    const deletedWalk = await walksCollection.findOneAndDelete({
      _id: walkObjectId,
    });

    if (!deletedWalk) {
      return NextResponse.json({ success: false, message: "Walk not found" }, { status: 404 });
    }

    const updateResult = await usersCollection.updateMany(
      {
        $or: [
          { "walkDetails.ownWalk": walkId },
          { "walkDetails.supportedWalk": walkId },
          { "walkDetails.savedWalk": walkId },
        ],
      },
      {
        $pull: {
          "walkDetails.ownWalk": walkId,
          "walkDetails.supportedWalk": walkId,
          "walkDetails.savedWalk": walkId,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Walk deleted successfully",
        modifiedUsers: updateResult.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleteWalkAndUpdateUsers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting walk",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
