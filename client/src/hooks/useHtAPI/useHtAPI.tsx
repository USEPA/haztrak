import { useEffect, useState } from 'react';
import htApi from 'services';

/**
 * On success, returns the body of the GET request as well as loading and errors
 *
 * @description
 * Easy abstraction for GET request from the haztrak http server. Currently,
 * does not support other http methods since those situations tend to require
 * more thought.
 *
 * @param url {string}
 * @return [data, loading, error]
 *
 * @example
 * const [data, loading , error ] = useHtApi<MyType>(`/api/resource/path/${id}`)
 */
export default function useHtAPI<T>(url: string) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<Boolean>(true);
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
