import { Post } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const subject = searchParams.get("subject");
  const title = searchParams.get("title")?.toLowerCase();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const client = await clientPromise;
  const db = client.db("Users");
  const collection = db.collection<Post>("walks");

  let filteredData = await collection.find().toArray();

  if (subject === "categorized") {
    const groupedPosts = getGroupedPostsBySubject(filteredData);
    const paginatedGroupedPosts = groupedPosts.map((group) => {
      const paginatedPosts = group.posts.slice(startIndex, endIndex);
      return {
        subject: group.subject,
        posts: paginatedPosts,
      };
    });

    return NextResponse.json({
      success: true,
      data: paginatedGroupedPosts,
      totalItems: groupedPosts.length,
      page,
      limit,
    });
  } else if (subject && subject !== "null") {
    filteredData = filteredData.filter(
      (post) => post.detail.subject === subject,
    );
  }

  if (title) {
    filteredData = filteredData.filter((post) =>
      post.title.toLowerCase().includes(title),
    );
  }

  const paginatedData = filteredData.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: paginatedData,
    totalItems: filteredData.length,
    page,
    limit,
  });
}

function getGroupedPostsBySubject(filteredData: Post[]) {
  const groupedPosts: { [key: string]: Post[] } = {};
  filteredData.forEach((post: Post) => {
    const subject = post.detail.subject;
    if (!groupedPosts[subject]) {
      groupedPosts[subject] = [];
    }
    groupedPosts[subject].push(post);
  });

  return Object.keys(groupedPosts).map((subject) => ({
    subject: subject,
    posts: groupedPosts[subject],
  }));
}
