import clientPromise from "@/lib/database/mongodb";
import { HttpErrorCodes } from "@/lib/enums/httpErrorCodes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('sample_airbnb'); 
    const collection = db.collection('listingsAndReviews'); 

    const data = await collection.find({}).limit(10).toArray();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('MongoDB Hatası:', error);
    return NextResponse.json({ success: false, message: 'Veri çekilirken hata oluştu.' }, { status: HttpErrorCodes.INTERNAL_SERVER_ERROR });
  }
}
