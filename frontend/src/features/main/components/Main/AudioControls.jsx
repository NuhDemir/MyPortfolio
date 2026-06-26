import React, { forwardRef, useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Repeat1, ListMusic, Disc3 } from "lucide-react";
import { gsap } from "gsap";
import { PatternBackground } from "@shared";
import "./style/AudioControls.css";

const SOUNDCLOUD_URL = "https://soundcloud.com/nuh-demir-210070335/sets/playlist";
const WIDGET_SCRIPT = "https://w.soundcloud.com/player/api.js";

const REPEAT_MODES = ["none", "one", "all"];
const REPEAT_ICONS = { none: Repeat, one: Repeat1, all: Repeat };
const REPEAT_LABELS = { none: "Tekrar yok", one: "Tekrarla", all: "Tümünü tekrarla" };

const formatTitle = (title) => {
  if (!title) return "SoundCloud Playlist";
  return title.length > 42 ? `${title.slice(0, 39)}...` : title;
};

const fmt = (t) => {
  if (isNaN(t) || t <= 0) return "0:00";
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const loadSC = () => {
  if (typeof window === "undefined") return Promise.reject();
  return new Promise((resolve, reject) => {
    if (window.SC?.Widget) { resolve(window.SC); return; }
    const el = document.querySelector(`script[src="${WIDGET_SCRIPT}"]`);
    if (el && !el.crossOrigin) { el.addEventListener("load", () => resolve(window.SC), { once: true }); return; }
    if (el) el.remove();
    const s = document.createElement("script"); s.src = WIDGET_SCRIPT; s.async = true;
    s.onload = () => setTimeout(() => resolve(window.SC), 100);
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
};

const buildUrl = () => `https://w.soundcloud.com/player/?${new URLSearchParams({ url: SOUNDCLOUD_URL, auto_play: "true", hide_related: "true", show_comments: "false", show_user: "true", visual: "false", buying: "false", sharing: "false", download: "false" })}`;

const AudioControls = forwardRef(({ onIsPlayingChange, onAudioDataChange }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none");
  const [playlist, setPlaylist] = useState([]);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const progRef = useRef(null);
  const rootRef = useRef(null);
  const timelineRef = useRef(null);

  const setControlsRef = useCallback((node) => {
    rootRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const refreshTrack = useCallback((w) => {
    w?.getCurrentSound((s) => {
      if (s) setCurrentTrack(s);
    });
  }, []);

  const loadPlaylist = useCallback((w) => {
    w?.getSounds((sounds) => {
      if (Array.isArray(sounds) && sounds.length) setPlaylist(sounds);
    });
  }, []);

  // ── GSAP Intro ────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.set(node, { autoAlpha: 1, y: 0, rotate: 0, filter: "none" });
      const tl = gsap.timeline({ defaults: { immediateRender: false } });
      tl.from(node, { y: 64, autoAlpha: 0, rotate: 1.4, duration: 0.75, ease: "power3.out" })
        .from(node.querySelector(".ac-info"), { y: 20, autoAlpha: 0, duration: 0.42, ease: "power2.out" }, "-=0.42")
        .from(node.querySelectorAll(".ac-label, .ac-song"), { y: 8, autoAlpha: 0, stagger: 0.06, duration: 0.28, ease: "power1.out" }, "-=0.22")
        .from(node.querySelector(".ac-timeline"), { autoAlpha: 0, scaleX: 0.32, transformOrigin: "left center", duration: 0.44, ease: "power2.out" }, "-=0.15")
        .from(node.querySelectorAll(".ac-time"), { autoAlpha: 0, y: 7, stagger: 0.05, duration: 0.24, ease: "power1.out" }, "-=0.35")
        .from(node.querySelector(".ac-ctrls"), { autoAlpha: 0, y: 18, duration: 0.34, ease: "power2.out" }, "-=0.2")
        .from(node.querySelectorAll(".ac-btn, .ac-vol"), { autoAlpha: 0, y: 12, scale: 0.74, stagger: { each: 0.045, from: "center" }, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // ── Widget Init ───────────────────────────────────────────────────────
  useEffect(() => {
    let dead = false;
    const init = async () => {
      try {
        const sc = await loadSC(); if (dead || !iframeRef.current) return;
        const w = sc.Widget(iframeRef.current);
        widgetRef.current = w;

        w.bind(sc.Widget.Events.READY, () => {
          if (dead) return;
          setIsReady(true);
          w.getDuration((d) => setDuration((d || 0) / 1000));
          refreshTrack(w);
          setTimeout(() => loadPlaylist(w), 800);
          setTimeout(() => loadPlaylist(w), 2500);
          w.play(); setIsPlaying(true); onIsPlayingChange?.(true);
        });
        w.bind(sc.Widget.Events.PLAY, () => {
          if (dead) return;
          setIsPlaying(true); onIsPlayingChange?.(true);
          refreshTrack(w);
          setTimeout(() => loadPlaylist(w), 600);
        });
        w.bind(sc.Widget.Events.PAUSE, () => {
          if (dead) return;
          setIsPlaying(false); onIsPlayingChange?.(false);
        });
        w.bind(sc.Widget.Events.PLAY_PROGRESS, (e) => {
          if (dead) return;
          setCurrentTime((e?.currentPosition || 0) / 1000);
          w.getDuration((d) => setDuration((d || 0) / 1000));
        });
        w.bind(sc.Widget.Events.FINISH, () => {
          if (dead) return;
          if (repeatMode === "one") {
            w.seekTo(0); w.play();
          } else if (repeatMode === "all") {
            refreshTrack(w); setTimeout(() => loadPlaylist(w), 400);
          } else {
            refreshTrack(w);
          }
        });
      } catch {
        if (!dead) { setIsError(true); setIsReady(false); }
      }
    };
    init(); return () => { dead = true; };
  }, []);

  // Re-bind repeat handler when mode changes
  useEffect(() => {
    const w = widgetRef.current;
    if (!w || !isReady) return;
  }, [repeatMode, isReady]);

  useEffect(() => { if (widgetRef.current && isReady) widgetRef.current.setVolume((isMuted ? 0 : volume) * 100); }, [isMuted, isReady, volume]);
  useEffect(() => {
    if (!progRef.current || !duration) return;
    progRef.current.style.width = `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%`;
  }, [currentTime, duration]);

  // ── Keyboard Shortcuts ────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const w = widgetRef.current;
      if (!w || !isReady) return;
      switch (e.code) {
        case "Space": e.preventDefault(); isPlaying ? w.pause() : w.play(); break;
        case "ArrowLeft": e.preventDefault(); w.prev(); refreshTrack(w); break;
        case "ArrowRight": e.preventDefault(); w.next(); refreshTrack(w); break;
        case "ArrowUp": e.preventDefault(); setVolume((v) => Math.min(1, v + 0.05)); break;
        case "ArrowDown": e.preventDefault(); setVolume((v) => Math.max(0, v - 0.05)); break;
        case "KeyM": e.preventDefault(); setIsMuted((m) => !m); break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPlaying, isReady, refreshTrack]);

  // ── Controls ──────────────────────────────────────────────────────────
  const toggle = () => { if (!widgetRef.current) return; isPlaying ? widgetRef.current.pause() : widgetRef.current.play(); };
  const prevTrack = () => { if (!widgetRef.current || !isReady) return; widgetRef.current.prev(); refreshTrack(widgetRef.current); };
  const nextTrack = () => { if (!widgetRef.current || !isReady) return; widgetRef.current.next(); refreshTrack(widgetRef.current); };
  const skipTo = (i) => { if (!widgetRef.current || !isReady) return; widgetRef.current.skip(i); refreshTrack(widgetRef.current); setPlaylistOpen(false); };
  const toggleShuffle = () => setIsShuffled((s) => !s);
  const cycleRepeat = () => { setRepeatMode((m) => REPEAT_MODES[(REPEAT_MODES.indexOf(m) + 1) % 3]); };

  const seek = (e) => {
    if (!widgetRef.current || !duration) return;
    const r = e.currentTarget.getBoundingClientRect(), p = (e.clientX - r.left) / r.width;
    const s = Math.max(0, Math.min(duration, p * duration));
    widgetRef.current.seekTo(s * 1000); setCurrentTime(s);
  };

  const handleTimelineHover = (e) => {
    const r = timelineRef.current?.getBoundingClientRect();
    if (!r || !duration) return;
    const p = (e.clientX - r.left) / r.width;
    setHoverX(e.clientX - r.left);
    setHoverTime(Math.max(0, p * duration));
  };

  const handleTimelineLeave = () => setHoverTime(null);

  const nowName = formatTitle(currentTrack?.title);
  const nowArt = currentTrack?.artwork_url;
  const currentIdx = currentTrack ? playlist.findIndex((t) => t.title === currentTrack.title) : -1;

  return (
    <div ref={setControlsRef} className="ac">
      <PatternBackground variant="naiveSketch" opacity={0.26} className="ac-pattern" seed="ac-naive" />

      {/* ── Track Info + Artwork ──────────────────────────────────── */}
      <div className="ac-info">
        <div className={`ac-art ${isPlaying ? "ac-art--spinning" : ""} ac-art--3d`}>
          {nowArt ? <img src={nowArt} alt="" /> : <Disc3 size={28} />}
        </div>
        <div className="ac-meta">
          <span className="ac-label">ŞARKILARIM</span>
          <span className="ac-song">{nowName}</span>
        </div>
      </div>

      {/* ── Error Fallback ────────────────────────────────────────── */}
      {isError && (
        <div className="ac-error">
          <p>Müzik oynatıcı yüklenemedi.{" "}
            <a href={SOUNDCLOUD_URL} target="_blank" rel="noopener noreferrer" className="ac-error-link">
              SoundCloud&apos;ta dinle
            </a>
          </p>
        </div>
      )}

      {/* ── Timeline ───────────────────────────────────────────────── */}
      <div className="ac-timeline">
        <span className="ac-time">{fmt(currentTime)}</span>
        <div
          className="ac-bar"
          onClick={seek}
          onMouseMove={handleTimelineHover}
          onMouseLeave={handleTimelineLeave}
          ref={timelineRef}
        >
          <div className={`ac-fill ${isPlaying ? "ac-fill--flow" : ""}`} ref={progRef} />
          {hoverTime != null && (
            <div className="ac-hover-tooltip" style={{ left: `${Math.min(100, Math.max(0, hoverX / (timelineRef.current?.offsetWidth || 1) * 100))}%` }}>
              {fmt(hoverTime)}
            </div>
          )}
        </div>
        <span className="ac-time">{fmt(duration)}</span>
      </div>

      {/* ── Controls ───────────────────────────────────────────────── */}
      <div className="ac-ctrls">
        <div className="ac-ctrls__main">
          <button type="button" className={`ac-btn ac-btn--toggle ${isShuffled ? "ac-btn--active" : ""}`} onClick={toggleShuffle} title="Karıştır" disabled={!isReady}>
            <Shuffle size={16} />
          </button>
          <button type="button" className="ac-btn" onClick={prevTrack} disabled={!isReady} title="Önceki">
            <SkipBack size={20} />
          </button>
          <button type="button" className="ac-btn ac-btn--play" onClick={toggle} disabled={!isReady} title={isPlaying ? "Duraklat" : "Oynat"}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button type="button" className="ac-btn" onClick={nextTrack} disabled={!isReady} title="Sonraki">
            <SkipForward size={20} />
          </button>
          <button
            type="button"
            className={`ac-btn ac-btn--toggle ${repeatMode !== "none" ? "ac-btn--active" : ""}`}
            onClick={cycleRepeat}
            title={REPEAT_LABELS[repeatMode]}
            disabled={!isReady}
          >
            {React.createElement(REPEAT_ICONS[repeatMode], { size: 16 })}
            {repeatMode === "one" && <span className="ac-btn__dot" />}
          </button>
        </div>

        <div className="ac-vol">
          <button type="button" className="ac-btn ac-btn--sm" onClick={() => setIsMuted(!isMuted)} title={isMuted ? "Sesi aç" : "Sesi kapat"}>
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }} className="ac-vol-slider" disabled={!isReady} />
        </div>

        <button type="button" className={`ac-btn ac-btn--toggle ${playlistOpen ? "ac-btn--active" : ""}`} onClick={() => setPlaylistOpen((o) => !o)} title="Parça listesi" disabled={!isReady}>
          <ListMusic size={16} />
          <span className="ac-btn__count">{playlist.length}</span>
        </button>
      </div>

      {/* ── Playlist ────────────────────────────────────────────────── */}
      {playlistOpen && playlist.length > 0 && (
        <div className="ac-playlist">
          <div className="ac-playlist__head">
            <span>Parça Listesi</span>
            <span className="ac-playlist__total">{playlist.length} parça</span>
          </div>
          <div className="ac-playlist__list">
            {playlist.map((t, i) => {
              const isActive = i === currentIdx;
              return (
                <button
                  key={t.title + i}
                  type="button"
                  className={`ac-playlist__track ${isActive ? "ac-playlist__track--active" : ""} ${isActive && isPlaying ? "ac-playlist__track--playing" : ""}`}
                  onClick={() => skipTo(i)}
                >
                  <span className="ac-playlist__idx">{isActive && isPlaying ? <Pause size={10} /> : isActive ? <Play size={10} /> : i + 1}</span>
                  <span className="ac-playlist__art">
                    {t.artwork_url ? <img src={t.artwork_url} alt="" /> : <Disc3 size={14} />}
                  </span>
                  <span className="ac-playlist__name">{t.title}</span>
                  <span className="ac-playlist__dur">{fmt((t.duration || 0) / 1000)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <iframe ref={iframeRef} title="SC" src={buildUrl()} allow="autoplay" style={{ position:"fixed",left:-9999,top:0,width:1,height:1,opacity:0,pointerEvents:"none",border:0 }} />
    </div>
  );
});

AudioControls.displayName = "AudioControls";
export default AudioControls;
