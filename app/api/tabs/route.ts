import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

// Handler for POST requests to /api/tabs
export async function POST(request: Request) {
  try {
    // Parse the incoming request body as JSON
    const body = await request.json();
    const { name, htmlCode, jsCode } = body;

    // Basic validation: Ensure required fields are present
    if (!name || !htmlCode || !jsCode) {
      return NextResponse.json(
        { error: 'Missing required fields: name, htmlCode, jsCode' },
        { status: 400 } // Bad Request
      );
    }

    // Use Prisma Client to create a new record in the TabSet table
    const newTabSet = await prisma.tabSet.create({
      data: {
        name: name,
        htmlCode: htmlCode,
        jsCode: jsCode,
      },
    });

    // Return the newly created record as a JSON response
    return NextResponse.json(newTabSet, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Failed to create TabSet:', error);
    // Return a generic error response
    return NextResponse.json(
      { error: 'Failed to save tab set' },
      { status: 500 } // Internal Server Error
    );
  }
}


