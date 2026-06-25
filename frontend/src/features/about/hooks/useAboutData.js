import { useState, useEffect } from "react";
import { cloneDefaultAboutContent } from "@features/about";
import { fetchAboutContent, fetchGitHubStats } from "../services/aboutService.js";

const STATIC_METRICS = [
  { key: "soundcloud", value: "--", label: "Dinleyici", icon: "☁️" },
  { key: "projectsCount", value: "--", label: "Proje" },
  { key: "technologies", value: "--", label: "Teknoloji" },
];

export const useAboutData = () => {
  const [content, setContent] = useState(null);
  const [github, setGithub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      const [about, gh] = await Promise.all([
        fetchAboutContent(controller.signal).catch(() => null),
        fetchGitHubStats(controller.signal).catch(() => null),
      ]);
      if (cancelled) return;
      setContent(about ?? cloneDefaultAboutContent());
      setGithub(gh);
      setLoading(false);
    };

    load();
    return () => { cancelled = true; controller.abort(); };
  }, []);

  return { content, github, loading };
};
