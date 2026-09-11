import { useCallback, useEffect, useState } from 'react';
import * as data from '../lib/data';

export function useTodos(userId) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setTodos(await data.fetchTodos(userId));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTodo = async (text) => {
    const created = await data.createTodo(userId, text);
    setTodos((prev) => [...prev, created]);
  };

  const removeTodo = async (todoId) => {
    await data.deleteTodo(userId, todoId);
    setTodos((prev) => prev.filter((t) => t.id !== todoId));
  };

  return { todos, loading, addTodo, removeTodo };
}
