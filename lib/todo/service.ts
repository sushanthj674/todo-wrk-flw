import { Todo } from './types';
import crypto from 'crypto';

// Simulated database (In-memory for now, as requested)
let todos: Todo[] = [];

export class BackendTodoService {
  static async getTodos(): Promise<Todo[]> {
    return [...todos];
  }

  static async addTodo(text: string): Promise<Todo> {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    todos.push(newTodo);
    return newTodo;
  }

  static async deleteTodo(id: string): Promise<void> {
    todos = todos.filter((t) => t.id !== id);
  }

  static async toggleTodo(id: string): Promise<void> {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }
}
