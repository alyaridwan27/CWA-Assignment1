import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
import prisma from '@/lib/prisma';

// Define a type for the context object that Next.js passes
type RouteContext = {
  params: {
    id: string;
  };
};

// Handler for PUT requests to /api/tabs/[id] (for UPDATING)
export async function PUT(
  request: NextRequest, // Use the specific NextRequest
  context: RouteContext // Use our defined Context type
) {
  try {
    const id = context.params.id; // Access id from context.params
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name field is required' },
        { status: 400 }
      );
    }

    const updatedTabSet = await prisma.tabSet.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    return NextResponse.json(updatedTabSet, { status: 200 });
  } catch (error) {
    console.error(`Failed to update tab set with ID: ${context.params.id}`, error);

    // Type-safe error check for Prisma's "Record not found"
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Tab set not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to update tab set' },
      { status: 500 }
    );
  }
}

// Handler for DELETE requests to /api/tabs/[id] (for DELETING)
export async function DELETE(
  request: NextRequest, // Use the specific NextRequest
  context: RouteContext // Use our defined Context type
) {
  try {
    const id = context.params.id; // Access id from context.params

    await prisma.tabSet.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: 'Tab set deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to delete tab set with ID: ${context.params.id}`, error);

    // Type-safe error check for Prisma's "Record not found"
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Tab set not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to delete tab set' },
      { status: 500 }
    );
  }
}