import { useEffect, useState } from 'react';
import { htApi } from 'services';

/**
 * Hook for retrieving data from the haztrak http server
 *
 * @description
 * Easy abstraction for GET request from the haztrak http server. Currently,
 * does not support other http methods since those situations tend to require
 * more thought.
 *
 * @param url {string}
 * @return array {[data, loading, error]}
 *
 * @example
 * const [data, loading , error ] = useHtApi<MyType>(`/api/resource/path/${id}`)
 */
export function useHtApi<T>(url: string) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!url) return;
    htApi
      .get(url)
      .then((response) => setData(response.data))
      .then(() => setLoading(false))
      .catch(setError);
  }, [url]);

  return [data, loading, error] as const;
}
