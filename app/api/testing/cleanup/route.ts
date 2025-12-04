import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    await prisma.escapeRoom.deleteMany({
      where: {
        title: {
          startsWith: "Playwright Test Room",
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
