import { NextResponse } from 'next/server';

// Dummy data for example purposes
let posts = [
    { id: 1, title: 'First Post', content: 'This is the first post' },
    { id: 2, title: 'Second Post', content: 'This is the second post' },
];

// CREATE (POST request)
export async function POST(request: Request) {
    const body = await request.json();
    const newPost = { id: posts.length + 1, ...body };
    posts.push(newPost);
    return NextResponse.json({ success: true, post: newPost });
}

// READ (GET request)
export async function GET() {
    return NextResponse.json({ success: true, posts });
}

// UPDATE (PUT request)
export async function PUT(request: Request) {
    const body = await request.json();
    const { id, title, content } = body;
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    posts[postIndex] = { id, title, content };
    return NextResponse.json({ success: true, post: posts[postIndex] });
}

// DELETE (DELETE request)
export async function DELETE(request: Request) {
    const { id } = await request.json();
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    posts = posts.filter(post => post.id !== id);
    return NextResponse.json({ success: true, message: 'Post deleted' });
}
