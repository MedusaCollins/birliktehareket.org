import { Post } from "@/lib/types";
import { NextResponse } from "next/server";

// Sample data
const fakeData: Post[] = [
  {
    title: "Climate Action March",
    description: "Join us in a march to raise awareness about climate change.",
    organizer: "Green Earth Organization",
    images: [
      "https://fastly.picsum.photos/id/596/500/300.jpg?hmac=iPv47NArnMzGEAqaVg4JOlixIpJdGIA9SB_mpQQpDmI",
    ],
    detail: {
      date: new Date("2024-11-12"),
      location: { start: "Central Park", end: "City Hall" },
      minimumPeopleExpectation: 500,
      subject: "Politika",
    },
    supporters: [
      { userId: "user123", date: new Date("2024-10-01") },
      { userId: "user456", date: new Date("2024-10-05") },
    ],
    updates: [
      {
        date: new Date("2024-10-15"),
        message: "Route change due to roadworks.",
        userId: "admin001",
        images: [
          "https://fastly.picsum.photos/id/237/500/300.jpg?hmac=xyz",
          "https://fastly.picsum.photos/id/238/500/300.jpg?hmac=abc",
        ],
      },
    ],
  },
  {
    title: "Equality Now Walk",
    description: "A walk for equality and human rights.",
    organizer: "Equality Now",
    images: [
      "https://fastly.picsum.photos/id/596/500/300.jpg?hmac=iPv47NArnMzGEAqaVg4JOlixIpJdGIA9SB_mpQQpDmI",
    ],
    detail: {
      date: new Date("2024-12-05"),
      location: { start: "Liberty Square", end: "Union Building" },
      minimumPeopleExpectation: 300,
      subject: "Ekonomi",
    },
    moderators: [{ userId: "mod789" }],
    supporters: [
      { userId: "user789", date: new Date("2024-10-12") },
      { userId: "user789", date: new Date("2024-10-12") },
      { userId: "user789", date: new Date("2024-10-12") },
      { userId: "user789", date: new Date("2024-10-12") },
      { userId: "user789", date: new Date("2024-10-12") },
      { userId: "user789", date: new Date("2024-10-12") },
    ],
  },
  {
    title: "Save the Oceans Rally",
    description: "Help us raise awareness about ocean pollution.",
    organizer: "Blue Ocean Foundation",
    images: [
      "https://fastly.picsum.photos/id/596/500/300.jpg?hmac=iPv47NArnMzGEAqaVg4JOlixIpJdGIA9SB_mpQQpDmI",
    ],
    detail: {
      date: new Date("2024-11-20"),
      location: { start: "Harbor Front", end: "Beachside" },
      minimumPeopleExpectation: 200,
      subject: "Politika",
    },
    moderators: [{ userId: "mod101" }, { userId: "mod202" }],
    updates: [
      {
        date: new Date("2024-10-18"),
        message: "Special guest speaker confirmed.",
        userId: "admin002",
      },
    ],
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Get page and limit from query parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const subject = searchParams.get("subject");

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  let filteredData = fakeData;

  if (subject != "null") {
    filteredData = fakeData.filter((post) => post.detail.subject == subject);
  }

  // Slice the data for pagination
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Response
  return NextResponse.json({
    success: true,
    data: paginatedData,
    totalItems: fakeData.length,
    page,
    limit,
  });
}
