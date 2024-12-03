import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { ObjectId, Condition } from "mongodb";

interface Walk {
  _id: ObjectId;
  title: string;
  detail: {
    subject: string;
    [key: string]: number | string | object | [];
  };
  [key: string]: number | string | object | [];
}

type GroupedPosts = Record<string, Walk[]>;

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("Users");
    const collection = db.collection<Walk>("walks");

    const { searchParams } = new URL(request.url);

    const ids = searchParams.get("ids");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const subject = searchParams.get("subject");
    const title = searchParams.get("title");

    const query: Record<string, Condition<string | number | object | []>> = {};

    const id = ids?.split(",") ?? null;

    if (id) {
      query._id = { $in: id.map((id) => new ObjectId(id)) };
    }

    if (subject && subject !== "categorized" && subject !== "null") {
      query["detail.subject"] = subject;
    }
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const totalItems = await collection.countDocuments(query);

    if (subject === "categorized") {
      const posts = await collection.find().toArray();

      const groupedPosts: GroupedPosts = posts.reduce<GroupedPosts>((acc, post) => {
        const postSubject = post.detail.subject;
        acc[postSubject] = acc[postSubject] || [];
        acc[postSubject].push(post);
        return acc;
      }, {});

      const groupedPostsArray = Object.entries(groupedPosts).map(([key, posts]) => ({
        subject: key,
        posts: posts.slice((page - 1) * limit, page * limit),
      }));

      return NextResponse.json({
        success: true,
        data: groupedPostsArray,
        totalItems: Object.keys(groupedPosts).length,
        page,
        limit,
      });
    }

    const filteredData = await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: filteredData,
      totalItems,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
