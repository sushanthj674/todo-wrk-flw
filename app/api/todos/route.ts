import { NextResponse } from 'next/server';
import { BackendTodoService } from '@/lib/todo/service';

export async function GET() {
  const todos = await BackendTodoService.getTodos();
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }
  const todo = await BackendTodoService.addTodo(text);
  return NextResponse.json(todo);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  await BackendTodoService.deleteTodo(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  await BackendTodoService.toggleTodo(id);
  return NextResponse.json({ success: true });
}
