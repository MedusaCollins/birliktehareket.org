import { NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";

interface moderatorOrSupporter {
  userId: ObjectId;
  date: string;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("Users");
    const walksCollection = db.collection("walks");
    const usersCollection = db.collection("accounts");

    const post = await walksCollection.findOne({
      _id: new ObjectId(params.id),
    });

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found." });
    }

    const getUserInfo = async (userId: ObjectId) => {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (user) {
        return {
          userId,
          ownWalkCount: user.walkDetails.ownWalk.length,
          userImage: user.image,
          username: user.username,
          email: user.email,
        };
      }
      return {
        userId,
        error: "User not found",
      };
    };
    const createdByUser = await getUserInfo(post.postInfo.createdBy);
    post.postInfo.createdBy = createdByUser;

    if (post.moderators) {
      post.moderators = await Promise.all(
        post.moderators.map(async (moderator: moderatorOrSupporter) => {
          const userInfo = await getUserInfo(moderator.userId);
          return {
            ...moderator,
            ...userInfo,
          };
        }),
      );
    }

    if (post.updates) {
      post.updates = await Promise.all(
        post.updates.map(async (update: moderatorOrSupporter) => {
          const userInfo = await getUserInfo(update.userId);
          return {
            ...update,
            ...userInfo,
          };
        }),
      );
    }

    if (post.supporters) {
      post.supporters = await Promise.all(
        post.supporters.map(async (supporter: moderatorOrSupporter) => {
          const userInfo = await getUserInfo(supporter.userId);
          return {
            ...supporter,
            ...userInfo,
          };
        }),
      );
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
