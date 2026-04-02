'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/lib/todo/types';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ text: inputText }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      setInputText('');
      fetchTodos();
    }
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/api/todos?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchTodos();
    }
  };

  const toggleTodo = async (id: string) => {
    const res = await fetch('/api/todos', {
      method: 'PATCH',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      fetchTodos();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="todo-container">
      <h1>Todo App (Next.js)</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="What needs to be done?"
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul id="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span className="todo-text">{todo.text}</span>
            <div className="actions">
              <button className="toggle-btn" onClick={() => toggleTodo(todo.id)}>
                {todo.completed ? 'Undo' : 'Done'}
              </button>
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
