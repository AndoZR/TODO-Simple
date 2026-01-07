import { useState, useEffect, useRef } from 'react';
import './App.css';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:3001/api';
const SEARCH_DEBOUNCE_MS = 300; // Delay 300ms setelah user berhenti mengetik

// Helper function untuk mendapatkan atau membuat userId
const getUserId = (): string => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    // Generate simple userId jika belum ada
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// Helper function untuk membuat fetch dengan auth header
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<Response> => {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (includeAuth) {
    const userId = getUserId();
    headers['x-user-id'] = userId;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeAuth, setIncludeAuth] = useState(true); // Toggle untuk testing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTodos = async (searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = searchQuery
        ? `${API_BASE_URL}/todos?search=${encodeURIComponent(searchQuery)}`
        : `${API_BASE_URL}/todos`;
      const response = await fetchWithAuth(url);
      
      if (response.status === 401) {
        throw new Error('Unauthorized: Missing x-user-id header');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout untuk debounce
    searchTimeoutRef.current = setTimeout(() => {
      fetchTodos(search || undefined);
    }, SEARCH_DEBOUNCE_MS);

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo.trim() }),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Missing x-user-id header');
      }

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      setNewTodo('');
      await fetchTodos(search || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompleted = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/todos/${id}`, {
        method: 'PATCH',
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Missing x-user-id header');
      }

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      await fetchTodos(search || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    // Tidak perlu langsung fetchTodos di sini, useEffect akan handle dengan debounce
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Todo App</h1>

        <form onSubmit={handleAddTodo} className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
            disabled={loading}
          />
          <button type="submit" className="add-button" disabled={loading}>
            Add
          </button>
        </form>

        <div className="search-container">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search todos..."
            className="search-input"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        )}

        <div className="todos-container">
          {todos.length === 0 && !loading ? (
            <div className="empty-state">No todos found</div>
          ) : (
            <div className={loading ? 'loading-overlay' : ''}>
              <table className="todos-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo, index) => (
                    <tr key={todo.id}>
                      <td>{index + 1}</td>
                      <td className={todo.completed ? 'completed' : ''}>
                        {todo.title}
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleCompleted(todo.id)}
                          disabled={loading}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

