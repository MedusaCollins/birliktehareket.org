import { Post } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { fakeData } from "@/lib/database/fakeData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const subject = searchParams.get("subject");
  const title = searchParams.get("title")?.toLowerCase();

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  let filteredData = fakeData;

  if (subject === "categorized") {
    const groupedPosts = getGroupedPostsBySubject();

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

function getGroupedPostsBySubject() {
  const groupedPosts: { [key: string]: Post[] } = {};

  fakeData.forEach((post) => {
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
