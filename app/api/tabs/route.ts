import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer("tabs");

export async function POST(request: Request) {
  return await tracer.startActiveSpan("tabs_post", async (span) => {
    try {
      const body = await request.json();
      const { name, htmlCode, jsCode } = body;

      if (!name || !htmlCode || !jsCode) {
        return NextResponse.json(
          { error: 'Missing required fields: name, htmlCode, jsCode' },
          { status: 400 }
        );
      }

      const created = await prisma.tabSet.create({
        data: { name, htmlCode, jsCode },
      });

      return NextResponse.json(created, { status: 201 });
    } catch (error: any) {
      span.recordException(error);
      console.error("Failed to create tab:", error);
      return NextResponse.json(
        { error: "Failed to save tab set" },
        { status: 500 }
      );
    } finally {
      span.end();
    }
  });
}

export async function GET() {
  return await tracer.startActiveSpan("tabs_get", async (span) => {
    try {
      const tabs = await prisma.tabSet.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(tabs, { status: 200 });
    } catch (error: any) {
      span.recordException(error);
      console.error("Failed to fetch TabSets:", error);
      return NextResponse.json(
        { error: "Failed to fetch TabSets" },
        { status: 500 }
      );
    } finally {
      span.end();
    }
  });
}
