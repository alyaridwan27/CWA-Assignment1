import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define a type for the route parameters
type Context = {
  params: {
    id: string;
  };
};

// Handler for PUT requests to /api/tabs/[id] (for UPDATING)
// --- CHANGED: Switched from 'context: Context' to destructuring '{ params }' ---
export async function PUT(request: Request, { params }: Context) {
  try {
    const id = params.id; // Use params.id directly
    const body = await request.json();
    const { name } = body;

    // Basic validation
    if (!name) {
      return NextResponse.json(
        { error: 'Name field is required' },
        { status: 400 }
      );
    }

    // Use Prisma Client to update the record with the matching ID
    const updatedTabSet = await prisma.tabSet.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    // Return the updated record
    return NextResponse.json(updatedTabSet, { status: 200 });
  } catch (error) {
    console.error(`Failed to update tab set with ID: ${params.id}`, error);

    // Handle cases where the record is not found
    if (error instanceof Error && (error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Tab set not found' }, { status: 404 });
    }

    // Return a generic error response
    return NextResponse.json(
      { error: 'Failed to update tab set' },
      { status: 500 }
    );
  }
}

// Handler for DELETE requests to /api/tabs/[id] (for DELETING)
// --- CHANGED: Switched from 'context: Context' to destructuring '{ params }' ---
export async function DELETE(request: Request, { params }: Context) {
  try {
    const id = params.id; // Use params.id directly

    // Use Prisma Client to delete the record with the matching ID
    await prisma.tabSet.delete({
      where: {
        id: id,
      },
    });

    // Return a success response
    return NextResponse.json(
      { message: 'Tab set deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to delete tab set with ID: ${params.id}`, error);

    if (error instanceof Error && (error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Tab set not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to delete tab set' },
      { status: 500 }
    );
  }
}