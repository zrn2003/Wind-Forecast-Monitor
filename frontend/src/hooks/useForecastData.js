import { useState, useCallback } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://wind-forecast-monitor-ohqy.onrender.com";

export function useForecastData() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async (start, end, horizon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/forecast-data`, {
        params: { start, end, horizon },
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
}
