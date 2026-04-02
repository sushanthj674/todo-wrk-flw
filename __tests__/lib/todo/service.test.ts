import { describe, it, expect, beforeEach } from 'vitest';
import { BackendTodoService } from '@/lib/todo/service';

describe('BackendTodoService', () => {
  beforeEach(async () => {
    // Clear the in-memory array before each test
    const todos = await BackendTodoService.getTodos();
    for (const todo of todos) {
      await BackendTodoService.deleteTodo(todo.id);
    }
  });

  it('should get an empty list of todos initially', async () => {
    const todos = await BackendTodoService.getTodos();
    expect(todos).toEqual([]);
  });

  it('should add a new todo', async () => {
    const todo = await BackendTodoService.addTodo('Test Todo');
    expect(todo).toHaveProperty('id');
    expect(todo.text).toBe('Test Todo');
    expect(todo.completed).toBe(false);

    const todos = await BackendTodoService.getTodos();
    expect(todos.length).toBe(1);
    expect(todos[0]).toEqual(todo);
  });

  it('should delete a todo', async () => {
    const todo = await BackendTodoService.addTodo('Test Todo');
    await BackendTodoService.deleteTodo(todo.id);
    const todos = await BackendTodoService.getTodos();
    expect(todos).toEqual([]);
  });

  it('should toggle a todo completion status', async () => {
    const todo = await BackendTodoService.addTodo('Test Todo');
    await BackendTodoService.toggleTodo(todo.id);
    
    let todos = await BackendTodoService.getTodos();
    expect(todos[0].completed).toBe(true);

    await BackendTodoService.toggleTodo(todo.id);
    todos = await BackendTodoService.getTodos();
    expect(todos[0].completed).toBe(false);
  });

  it('should handle toggling a non-existent todo gracefully', async () => {
    // Should not throw
    await expect(BackendTodoService.toggleTodo('non-existent')).resolves.not.toThrow();
  });
});
