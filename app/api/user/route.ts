import { NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import { Document, Filter } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const excludeIds = searchParams.getAll("exclude");

    const page = searchParams.has("page") ? parseInt(searchParams.get("page") || "1", 10) : null; // For later use maybe not
    const limit = searchParams.has("limit") ? parseInt(searchParams.get("limit") || "10", 10) : 10;

    if (!query || !query.trim()) {
      return NextResponse.json([]);
    }

    const client = await clientPromise;
    const db = client.db("Users");
    const usersCollection = db.collection("accounts");

    const filter: Filter<Document> = {
      $or: [{ userId: query }, { username: { $regex: query, $options: "i" } }],
    };

    try {
      const objectIdQuery = new ObjectId(query);
      filter.$or?.push({ _id: objectIdQuery });
    } catch {}

    if (excludeIds.length > 0) {
      const processedExcludeIds = excludeIds
        .map((id) => {
          try {
            return new ObjectId(id);
          } catch {
            return null;
          }
        })
        .filter((id): id is ObjectId => id !== null);

      filter._id = { $nin: processedExcludeIds };
    }

    let dbQuery = usersCollection.find(filter).limit(limit);

    if (page !== null) {
      const skip = (page - 1) * limit;
      dbQuery = dbQuery.skip(skip);

      const total = await usersCollection.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);
      const users = await dbQuery.toArray();

      return NextResponse.json({
        users,
        page,
        limit,
        total,
        totalPages,
      });
    } else {
      const users = await dbQuery.toArray();
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "An error occurred while fetching users" }, { status: 500 });
  }
}
