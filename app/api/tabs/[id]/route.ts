import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ====== UPDATE TAB (PUT) ======
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 
  const body = await request.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'Name field is required' },
      { status: 400 }
    );
  }

  try {
    const updatedTabSet = await prisma.tabSet.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedTabSet, { status: 200 });
  } catch (error: unknown) {
    console.error(`Failed to update tab set with ID: ${id}`, error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Tab set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update tab set' },
      { status: 500 }
    );
  }
}

// ====== DELETE TAB (DELETE) ======
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 

  try {
    await prisma.tabSet.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Tab set deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(`Failed to delete tab set with ID: ${id}`, error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Tab set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete tab set' },
      { status: 500 }
    );
  }
}
