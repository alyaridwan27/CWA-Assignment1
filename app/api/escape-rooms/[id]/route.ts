import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET ONE ROOM
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const room = await prisma.escapeRoom.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load room" },
      { status: 500 }
    );
  }
}

// UPDATE ROOM
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();

  try {
    const updated = await prisma.escapeRoom.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}

// DELETE ROOM
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.escapeRoom.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
