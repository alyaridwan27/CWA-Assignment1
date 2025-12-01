import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("tabs");

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await tracer.startActiveSpan("tabs_put", async (span) => {
    try {
      const { id } = await params;
      const body = await request.json();
      const { name } = body;

      if (!name) {
        return NextResponse.json(
          { error: "Name field is required" },
          { status: 400 }
        );
      }

      const updated = await prisma.tabSet.update({
        where: { id },
        data: { name },
      });

      return NextResponse.json(updated, { status: 200 });
    } catch (error: any) {
      span.recordException(error);
      console.error(`Failed to update tab ${error}`);

      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Tab set not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Failed to update tab set" },
        { status: 500 }
      );
    } finally {
      span.end();
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await tracer.startActiveSpan("tabs_delete", async (span) => {
    try {
      const { id } = await params;

      await prisma.tabSet.delete({
        where: { id },
      });

      return NextResponse.json(
        { message: "Tab set deleted successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      span.recordException(error);
      console.error(`Failed to delete tab: ${error}`);

      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Tab set not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Failed to delete tab set" },
        { status: 500 }
      );
    } finally {
      span.end();
    }
  });
}
