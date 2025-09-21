import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export const useApi = () => {
  const { token, logout } = useAuth();

  const apiCall = async <T = any>(
    url: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    const { requireAuth = true, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (requireAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  return { apiCall };
};

export const useApiState = <T>(
  initialData: T,
  fetchFn?: () => Promise<T>
) => {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (customFetchFn?: () => Promise<T>) => {
    const fn = customFetchFn || fetchFn;
    if (!fn) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchFn) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, setData };
};