import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export default function useQueryParams() {
  const [searchParams] = useSearchParams();

  const params = useMemo(() => {
    const queryParams = {};
    for (let [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    return queryParams;
  }, [searchParams]);

  return params;
}
