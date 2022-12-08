import { useEffect, useState } from 'react';
import htApi from 'services';

export default function useHtAPI<T>(url: string) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Boolean>(false);

  useEffect(() => {
    if (!url) return;
    console.log(url);
    htApi
      .get(url)
      .then((response) => setData(response.data))
      .then(() => setLoading(false))
      .catch(setError);
  }, [url]);

  return [data, loading, error] as const;
}
