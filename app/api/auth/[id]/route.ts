import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const account = await Account.findById(params.id);

    if (!account) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, account }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error fetching account.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { name, email } = await request.json();

    const account = await Account.findByIdAndUpdate(params.id, { name, email }, { new: true });

    if (!account) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, account }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error updating account.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const account = await Account.findByIdAndDelete(params.id);

    if (!account) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Account deleted.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error deleting account.' }, { status: 500 });
  }
}
