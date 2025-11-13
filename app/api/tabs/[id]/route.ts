import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define a type for the route parameters
type Params = {
  id: string;
};

// Handler for DELETE requests to /api/tabs/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const id = params.id;

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

    // Handle cases where the record is not found
    if (error instanceof Error && (error as any).code === 'P2025') {
      // P2025: Record to delete does not exist.
      return NextResponse.json({ error: 'Tab set not found' }, { status: 404 });
    }

    // Return a generic error response
    return NextResponse.json(
      { error: 'Failed to delete tab set' },
      { status: 500 }
    );
  }
}