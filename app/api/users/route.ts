import { NextRequest, NextResponse } from 'next/server';

interface Item {
  id: string;
  content: string;
}

let database: Item[] = []; 


const generateId = () => Math.random().toString(36).substr(2, 9);

export async function GET(request: NextRequest) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return NextResponse.json(database);
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ message: 'Content is required and must be a non-empty string.' }, { status: 400 });
    }

    const newItem: Item = { id: generateId(), content };
    database.push(newItem);

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json(newItem, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ message: 'Error processing request.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, content } = await request.json();

    if (typeof id !== 'string' || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ message: 'ID and content are required, and content must be a non-empty string.' }, { status: 400 });
    }

    const itemIndex = database.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
    }

    database[itemIndex].content = content;

    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json(database[itemIndex]);
  } catch (error) {
    console.error('Error handling PATCH request:', error);
    return NextResponse.json({ message: 'Error processing request.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ message: 'ID is required as a query parameter.' }, { status: 400 });
    }

    const initialLength = database.length;
    database = database.filter(item => item.id !== id);

    if (database.length === initialLength) {
      return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json({ message: 'Item deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ message: 'Error processing request.' }, { status: 500 });
  }
}