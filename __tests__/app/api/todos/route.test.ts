import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST, DELETE, PATCH } from '@/app/api/todos/route';
import { BackendTodoService } from '@/lib/todo/service';

vi.mock('@/lib/todo/service', () => ({
  BackendTodoService: {
    getTodos: vi.fn(),
    addTodo: vi.fn(),
    deleteTodo: vi.fn(),
    toggleTodo: vi.fn(),
  },
}));

describe('Todos API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/todos', () => {
    it('should return a list of todos', async () => {
      const mockTodos = [{ id: '1', text: 'Test', completed: false }];
      vi.mocked(BackendTodoService.getTodos).mockResolvedValue(mockTodos);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(300);
      expect(data).toEqual(mockTodos);
      expect(BackendTodoService.getTodos).toHaveBeenCalled();
    });
  });

  describe('POST /api/todos', () => {
    it('should add a new todo and return it', async () => {
      const mockTodo = { id: '1', text: 'Test', completed: false };
      vi.mocked(BackendTodoService.addTodo).mockResolvedValue(mockTodo);

      const request = new Request('http://localhost/api/todos', {
        method: 'POST',
        body: JSON.stringify({ text: 'Test' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTodo);
      expect(BackendTodoService.addTodo).toHaveBeenCalledWith('Test');
    });

    it('should return 400 if text is missing', async () => {
      const request = new Request('http://localhost/api/todos', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Text is required' });
    });
  });

  describe('DELETE /api/todos', () => {
    it('should delete a todo', async () => {
      const request = new Request('http://localhost/api/todos?id=1', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(BackendTodoService.deleteTodo).toHaveBeenCalledWith('1');
    });

    it('should return 400 if id is missing', async () => {
      const request = new Request('http://localhost/api/todos', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'ID is required' });
    });
  });

  describe('PATCH /api/todos', () => {
    it('should toggle a todo', async () => {
      const request = new Request('http://localhost/api/todos', {
        method: 'PATCH',
        body: JSON.stringify({ id: '1' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(BackendTodoService.toggleTodo).toHaveBeenCalledWith('1');
    });

    it('should return 400 if id is missing', async () => {
      const request = new Request('http://localhost/api/todos', {
        method: 'PATCH',
        body: JSON.stringify({}),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'ID is required' });
    });
  });
});
