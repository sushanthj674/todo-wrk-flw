import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoPage from '@/app/page';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TodoPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state initially and then fetches todos', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', text: 'Learn Testing', completed: false }],
    });

    render(<TodoPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Todo App (Next.js)')).toBeInTheDocument();
    expect(screen.getByText('Learn Testing')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('/api/todos');
  });

  it('adds a new todo', async () => {
    const user = userEvent.setup();
    
    // Initial fetch mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<TodoPage />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Mock POST request
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    // Mock second GET request after adding
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '2', text: 'New Todo', completed: false }],
    });

    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'New Todo');
    await user.click(addButton);

    expect(mockFetch).toHaveBeenCalledWith('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'New Todo' }),
    });

    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });
  });

  it('does not add a todo if input is empty or only whitespace', async () => {
    const user = userEvent.setup();
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<TodoPage />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(input, '   ');
    await user.click(addButton);

    // Only the initial GET request should have been made
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    
    // Initial fetch mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', text: 'To Delete', completed: false }],
    });

    render(<TodoPage />);

    await waitFor(() => {
      expect(screen.getByText('To Delete')).toBeInTheDocument();
    });

    // Mock DELETE request
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    // Mock second GET request after deleting
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(deleteButton);

    expect(mockFetch).toHaveBeenCalledWith('/api/todos?id=1', {
      method: 'DELETE',
    });

    await waitFor(() => {
      expect(screen.queryByText('To Delete')).not.toBeInTheDocument();
    });
  });

  it('toggles a todo', async () => {
    const user = userEvent.setup();
    
    // Initial fetch mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', text: 'To Toggle', completed: false }],
    });

    render(<TodoPage />);

    await waitFor(() => {
      expect(screen.getByText('To Toggle')).toBeInTheDocument();
    });

    // Mock PATCH request
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    // Mock second GET request after toggling
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', text: 'To Toggle', completed: true }],
    });

    const toggleButton = screen.getByRole('button', { name: 'Done' });
    await user.click(toggleButton);

    expect(mockFetch).toHaveBeenCalledWith('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: '1' }),
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    });
  });

  it('handles error when adding a todo fails', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<TodoPage />);
    await waitFor(() => { expect(screen.queryByText('Loading...')).not.toBeInTheDocument(); });

    // Mock failed POST request
    mockFetch.mockResolvedValueOnce({ ok: false });

    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'Failed Todo');
    await user.click(addButton);

    // Initial fetch was called, plus the POST. No second fetch should be called.
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('handles error when deleting a todo fails', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', text: 'To Delete', completed: false }],
    });
    render(<TodoPage />);
    await waitFor(() => { expect(screen.getByText('To Delete')).toBeInTheDocument(); });

    // Mock failed DELETE request
    mockFetch.mockResolvedValueOnce({ ok: false });

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(deleteButton);

    // Initial fetch, plus the DELETE. No second fetch should be called.
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('handles error when toggling a todo fails', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', text: 'To Toggle', completed: false }],
    });
    render(<TodoPage />);
    await waitFor(() => { expect(screen.getByText('To Toggle')).toBeInTheDocument(); });

    // Mock failed PATCH request
    mockFetch.mockResolvedValueOnce({ ok: false });

    const toggleButton = screen.getByRole('button', { name: 'Done' });
    await user.click(toggleButton);

    // Initial fetch, plus the PATCH. No second fetch should be called.
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
