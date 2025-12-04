import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("escape-rooms");

export async function GET() {
  return tracer.startActiveSpan("escape_rooms_get", async (span) => {
    try {
      const rooms = await prisma.escapeRoom.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(rooms, { status: 200 });
    } catch (error: any) {
      span.recordException(error);
      return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
    } finally {
      span.end();
    }
  });
}

export async function POST(request: Request) {
  return tracer.startActiveSpan("escape_rooms_post", async (span) => {
    try {
      const body = await request.json();
      const { title, description, backgroundImage, timerSeconds, puzzles } = body;

      const finalImage =
        backgroundImage ||
        "https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg";

      const created = await prisma.escapeRoom.create({
        data: {
          title,
          description,
          backgroundImage: finalImage,
          timerSeconds: timerSeconds || 300,
          puzzles,
        },
      });

      return NextResponse.json(created, { status: 201 });
    } catch (error: any) {
      span.recordException(error);
      return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
    } finally {
      span.end();
    }
  });
}
