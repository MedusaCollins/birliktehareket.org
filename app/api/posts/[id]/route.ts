import { NextResponse } from 'next/server';

// Dummy data for example purposes
const posts = [
    { id: 1, title: 'First Post', content: 'This is the first post' },
    { id: 2, title: 'Second Post', content: 'This is the second post' },
];

// GET a specific post by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params; // Get the ID from the URL parameter
    const post = posts.find(post => post.id === parseInt(id));

    if (!post) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
}
