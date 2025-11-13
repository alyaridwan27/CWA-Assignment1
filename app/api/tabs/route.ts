import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import our Prisma Client singleton

// Handler for POST requests to /api/tabs
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, htmlCode, jsCode } = body;

    if (!name || !htmlCode || !jsCode) {
      return NextResponse.json(
        { error: 'Missing required fields: name, htmlCode, jsCode' },
        { status: 400 } // Bad Request
      );
    }

    const newTabSet = await prisma.tabSet.create({
      data: {
        name: name,
        htmlCode: htmlCode,
        jsCode: jsCode,
      },
    });

    return NextResponse.json(newTabSet, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Failed to create TabSet:', error);
    return NextResponse.json(
      { error: 'Failed to save tab set' },
      { status: 500 } // Internal Server Error
    );
  }
}

// --- NEW: Handler for GET requests to /api/tabs ---
export async function GET() {
  try {
    // Use Prisma Client to find all records in the TabSet table
    // Order them by creation date, with the newest first
    const tabSets = await prisma.tabSet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Return the found records as a JSON response
    return NextResponse.json(tabSets, { status: 200 }); // 200 OK
  } catch (error) {
    console.error('Failed to fetch TabSets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tab sets' },
      { status: 500 } // Internal Server Error
    );
  }
}