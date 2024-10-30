import { NextResponse } from "next/server";
import { fakeData } from "@/lib/database/fakeData";

export async function GET(_: Request, { params }: { params: { id: number } }) {
    const post = fakeData.find((post) => post.id === Number(params.id));

    if (!post) {
        return NextResponse.json({ success: false, message: "Post not found." });
    }

    return NextResponse.json({
        success: true,
        data: fakeData.find((post) => post.id === Number(params.id)),
    });
}
