import { useState, useRef, useEffect, useCallback } from "react";

const SOUNDCLOUD_URL = "https://api.soundcloud.com/playlists/1863554286";
const WIDGET_SCRIPT = "https://w.soundcloud.com/player/api.js";

const loadSC = () => {
  if (typeof window === "undefined") return Promise.reject();
  return new Promise((resolve, reject) => {
    if (window.SC?.Widget) { resolve(window.SC); return; }
    
    const existingScript = document.querySelector(`script[src="${WIDGET_SCRIPT}"]`);
    if (existingScript) {
      const checkSC = setInterval(() => {
        if (window.SC?.Widget) {
          clearInterval(checkSC);
          resolve(window.SC);
        }
      }, 50);
      return;
    }

    const s = document.createElement("script");
    s.src = WIDGET_SCRIPT;
    s.async = true;
    s.onload = () => setTimeout(() => resolve(window.SC), 100);
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
};

export const buildSCUrl = () =>
  `https://w.soundcloud.com/player/?${new URLSearchParams({
    url: SOUNDCLOUD_URL,
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    visual: "false",
    buying: "false",
    sharing: "false",
    download: "false",
  })}`;

export const fmtTime = (t) => {
  if (isNaN(t) || t <= 0) return "0:00";
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

/**
 * Single Source of Truth for SoundCloud playback.
 * Extracted from MainV2.jsx so it can live at App level via Context.
 */
export const useSoundCloudPlayer = (shouldLoad) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [track, setTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [direction, setDirection] = useState(0);

  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const progRef = useRef(null);

  const appendToPlaylist = useCallback((sound) => {
    if (!sound) return;
    setPlaylist((prev) => {
      if (prev.some((s) => s.title === sound.title)) return prev;
      return [...prev, sound];
    });
  }, []);

  const loadPlaylist = useCallback((w) => {
    w.getSounds((sounds) => {
      if (Array.isArray(sounds) && sounds.length > 0) setPlaylist(sounds);
    });
  }, []);

  const refresh = useCallback((w) => {
    w.getCurrentSound((s) => {
      if (s) { setTrack(s); appendToPlaylist(s); }
    });
    w.getCurrentSoundIndex((i) => { if (typeof i === "number") setIndex(i); });
  }, [appendToPlaylist]);

  useEffect(() => {
    if (!shouldLoad) return;
    
    let dead = false;
    const init = async () => {
      try {
        const sc = await loadSC();
        if (dead || !iframeRef.current) return;
        const w = sc.Widget(iframeRef.current);
        widgetRef.current = w;

        w.bind(sc.Widget.Events.READY, () => {
          if (dead) return;
          setReady(true);
          w.getDuration((d) => setDuration((d || 0) / 1000));
          w.getCurrentSound((s) => { if (s) { setTrack(s); appendToPlaylist(s); } });
          w.getCurrentSoundIndex((i) => { if (typeof i === "number") setIndex(i); });
          setTimeout(() => loadPlaylist(w), 800);
          setTimeout(() => loadPlaylist(w), 2000);
        });
        w.bind(sc.Widget.Events.PLAY, () => {
          if (!dead) { setIsPlaying(true); refresh(w); }
          setTimeout(() => loadPlaylist(w), 600);
        });
        w.bind(sc.Widget.Events.PAUSE, () => {
          if (!dead) setIsPlaying(false);
        });
        w.bind(sc.Widget.Events.PLAY_PROGRESS, (e) => {
          if (dead) return;
          setCurrentTime((e?.currentPosition || 0) / 1000);
          w.getDuration((d) => setDuration((d || 0) / 1000));
        });
        w.bind(sc.Widget.Events.FINISH, () => {
          refresh(w);
          setTimeout(() => loadPlaylist(w), 400);
        });
      } catch { /* silent */ }
    };
    init();
    return () => { dead = true; };
  }, [shouldLoad]);

  useEffect(() => {
    if (widgetRef.current && ready) {
      widgetRef.current.setVolume((muted ? 0 : volume) * 100);
    }
  }, [muted, ready, volume]);

  useEffect(() => {
    if (!progRef.current || !duration) return;
    progRef.current.style.width = `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%`;
  }, [currentTime, duration]);

  const toggle = useCallback(() => {
    if (!widgetRef.current) return;
    isPlaying ? widgetRef.current.pause() : widgetRef.current.play();
  }, [isPlaying]);

  const next = useCallback(() => {
    if (!widgetRef.current) return;
    setDirection(1);
    widgetRef.current.next();
    refresh(widgetRef.current);
  }, [refresh]);

  const prev = useCallback(() => {
    if (!widgetRef.current) return;
    setDirection(-1);
    widgetRef.current.prev();
    refresh(widgetRef.current);
  }, [refresh]);

  const skip = useCallback((i) => {
    if (!widgetRef.current) return;
    setDirection(i > index ? 1 : -1);
    widgetRef.current.skip(i);
    refresh(widgetRef.current);
  }, [index, refresh]);

  const seek = useCallback((e) => {
    if (!widgetRef.current || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    const p = (e.clientX - r.left) / r.width;
    const s = Math.max(0, Math.min(duration, p * duration));
    widgetRef.current.seekTo(s * 1000);
    setCurrentTime(s);
  }, [duration]);

  const handleVolumeChange = useCallback((val) => {
    setVolume(val);
    if (muted) setMuted(false);
  }, [muted]);

  return {
    // State
    isPlaying, currentTime, duration, track, playlist, index,
    volume, muted, ready, direction,
    // Refs
    iframeRef, widgetRef, progRef,
    // Controls
    toggle, next, prev, skip, seek,
    setVolume: handleVolumeChange,
    setMuted,
    setDirection,
  };
};
