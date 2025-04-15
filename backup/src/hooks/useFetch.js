import { useEffect, useState } from 'react';

const useFetch = ({ url }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url) return;
    try {
      setIsLoading(true);
      const fetchData = async () => {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      };
      fetchData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { data, isLoading, error };
};

export default useFetch;
