import { useState, useEffect } from "react";
import { fetchServices } from "../services/aboutService.js";

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      const data = await fetchServices(controller.signal);
      if (!cancelled) {
        setServices(data);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; controller.abort(); };
  }, []);

  return { services, loading };
};
