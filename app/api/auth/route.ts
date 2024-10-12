import { NextResponse } from 'next/server';
import clientPromise from '@/lib/database/mongodb';

export async function POST(request: Request) {
  try {
    console.log("POST request received");

    // Parse the body only once
    const body = await request.json();
    console.log(body);

    // MongoDB client'ına eriş
    const client = await clientPromise;
    const db = client.db("Users"); // Kendi veritabanınızı kullanın
    const collection = db.collection("accounts");

    // İstekten gelen JSON verisini parse et
    const { username, email, password } = body;

    // Gerekli alanların eksik olup olmadığını kontrol et
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name and email are required." },
        { status: httpStatus.BAD_REQUEST }
      );
    }

    // Yeni bir hesap oluştur ve MongoDB'ye kaydet
    const newAccount = { username, email, password, createdAt: new Date() };
    const result = await collection.insertOne(newAccount);

    return NextResponse.json(
      { success: true, account: newAccount, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error creating account." },
      { status: 500 }
    );
  }
}

