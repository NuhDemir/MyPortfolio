import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3, Github, Linkedin, Youtube, Instagram, FileText } from "lucide-react";
import Title from "../components/Main/Title.jsx";
import Subtitle from "../components/Main/Subtitle.jsx";
import MainImage from "../components/Main/MainImage.jsx";
import "./MainV2.css";

const SOUNDCLOUD_URL = "https://soundcloud.com/nuh-demir-210070335/sets/playlist";
const WIDGET_SCRIPT = "https://w.soundcloud.com/player/api.js";

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

const fmt = (t) => { if (isNaN(t) || t <= 0) return "0:00"; const m = Math.floor(t / 60), s = Math.floor(t % 60); return `${m}:${s < 10 ? "0" : ""}${s}`; };

const SOCIALS = [
  { Icon: Github, href: "https://github.com/NuhDemir", label: "GitHub" },
  { Icon: Youtube, href: "https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi", label: "YouTube" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/nuh-demir-69b737261/", label: "LinkedIn" },
  { Icon: Instagram, href: "https://www.instagram.com/yazilimkiraathanesi/", label: "Instagram" },
];

const MainV2 = ({ onIsPlayingChange }) => {
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
    let dead = false;
    const init = async () => {
      try {
        const sc = await loadSC(); if (dead || !iframeRef.current) return;
        const w = sc.Widget(iframeRef.current); widgetRef.current = w;

        w.bind(sc.Widget.Events.READY, () => {
          if (dead) return; setReady(true);
          w.getDuration((d) => setDuration((d || 0) / 1000));
          w.getCurrentSound((s) => { if (s) { setTrack(s); appendToPlaylist(s); } });
          w.getCurrentSoundIndex((i) => { if (typeof i === "number") setIndex(i); });
          setTimeout(() => loadPlaylist(w), 800);
          setTimeout(() => loadPlaylist(w), 2000);
          w.play(); setIsPlaying(true); onIsPlayingChange?.(true);
        });
        w.bind(sc.Widget.Events.PLAY, () => {
          if (!dead) { setIsPlaying(true); onIsPlayingChange?.(true); refresh(w); }
          setTimeout(() => loadPlaylist(w), 600);
        });
        w.bind(sc.Widget.Events.PAUSE, () => { if (!dead) { setIsPlaying(false); onIsPlayingChange?.(false); } });
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
    init(); return () => { dead = true; };
  }, []);

  useEffect(() => { if (widgetRef.current && ready) widgetRef.current.setVolume((muted ? 0 : volume) * 100); }, [muted, ready, volume]);
  useEffect(() => {
    if (!progRef.current || !duration) return;
    progRef.current.style.width = `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%`;
  }, [currentTime, duration]);

  const toggle = () => { if (!widgetRef.current) return; isPlaying ? widgetRef.current.pause() : widgetRef.current.play(); };
  const next = () => { if (!widgetRef.current) return; setDirection(1); widgetRef.current.next(); refresh(widgetRef.current); };
  const prev = () => { if (!widgetRef.current) return; setDirection(-1); widgetRef.current.prev(); refresh(widgetRef.current); };
  const skip = (i) => {
    if (!widgetRef.current) return;
    const dir = i > index ? 1 : -1;
    setDirection(dir);
    widgetRef.current.skip(i);
    refresh(widgetRef.current);
  };
  const seek = (e) => {
    if (!widgetRef.current || !duration) return;
    const r = e.currentTarget.getBoundingClientRect(), p = (e.clientX - r.left) / r.width;
    const s = Math.max(0, Math.min(duration, p * duration));
    widgetRef.current.seekTo(s * 1000); setCurrentTime(s);
  };

  const nowName = track?.title || "SoundCloud Playlist";
  const nowArt = track?.artwork_url;

  const total = playlist.length;
  const prevIdx = total > 1 ? (index - 1 + total) % total : -1;
  const nextIdx = total > 1 ? (index + 1) % total : -1;

  const visible = [];
  if (total > 0) {
    if (prevIdx >= 0 && prevIdx !== index) visible.push({ ...playlist[prevIdx], pos: "prev", idx: prevIdx });
    visible.push({ ...playlist[index], pos: "current", idx: index });
    if (nextIdx >= 0 && nextIdx !== index) visible.push({ ...playlist[nextIdx], pos: "next", idx: nextIdx });
  }

  return (
    <>
      <section className="mn2">
        <div className="mn2__top">
          <MainImage />
        </div>

        <div className="mn2__body">
          <div className="mn2__left">
            <div className="mn2__pl-head">
              <span>Parça Listesi</span>
              <span className="mn2__pl-count">{total} parça</span>
            </div>
            <div className="mn2__pl-list">
              <AnimatePresence mode="popLayout" custom={direction}>
                {visible.map((t) => {
                  const isCurrent = t.pos === "current";
                  return (
                    <motion.button
                      key={t.pos}
                      layout
                      type="button"
                      className={`mn2__track mn2__track--${t.pos} ${isCurrent && isPlaying ? "mn2__track--glass" : ""}`}
                      onClick={() => { if (!isCurrent) skip(t.idx); }}
                      variants={{
                        enter: (d) => ({
                          y: d === 1 ? 50 : -50,
                          opacity: 0,
                          scale: 0.92,
                        }),
                        center: { y: 0, opacity: 1, scale: 1 },
                        exit: (d) => ({
                          y: d === 1 ? -50 : 50,
                          opacity: 0,
                          scale: 0.92,
                          transition: { duration: 0.18 },
                        }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      custom={direction}
                      transition={{ type: "spring", stiffness: 280, damping: 27 }}
                    >
                      <motion.span
                        className="mn2__track-art"
                        animate={{ width: isCurrent ? 52 : 36, height: isCurrent ? 52 : 36 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      >
                        {t.artwork_url ? (
                          <img src={t.artwork_url} alt="" className="mn2__track-img" />
                        ) : (
                          <span className="mn2__track-noart"><Disc3 size={isCurrent ? 20 : 14} /></span>
                        )}
                      </motion.span>
                      <motion.span
                        className="mn2__track-name"
                        animate={{ fontSize: isCurrent ? "15px" : "12px", fontWeight: isCurrent ? 600 : 400, opacity: isCurrent ? 1 : 0.45 }}
                        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                      >
                        {t.title}
                      </motion.span>
                      <span className="mn2__track-dur">{fmt(t.duration / 1000)}</span>
                      {isCurrent && isPlaying && (
                        <motion.span className="mn2__track-eq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <span /><span /><span />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="mn2__right">
            <Title />
            <Subtitle />
            <nav className="mn2__social" aria-label="Sosyal medya">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="mn2__social-link" aria-label={label}>
                  <Icon size={20} />
                </a>
              ))}
              <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="mn2__social-link" aria-label="CV">
                <FileText size={20} />
              </a>
            </nav>
          </div>
        </div>

        <div className="mn2__spacer" />

        <div className="mn2__player">
          <div className="mn2__player-inner">
            <div className="mn2__player-now">
              <div className="mn2__player-art">
                {nowArt ? <img src={nowArt} alt="" /> : <Disc3 size={24} />}
              </div>
              <div className="mn2__player-info">
                <span className="mn2__player-label">Şu An Çalıyor</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={nowName}
                    className="mn2__player-name"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {nowName}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="mn2__player-ctrl">
              <button type="button" className="mn2__pbtn" onClick={prev} disabled={!ready}><SkipBack size={16} /></button>
              <button type="button" className="mn2__pbtn mn2__pbtn--play" onClick={toggle} disabled={!ready}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              </button>
              <button type="button" className="mn2__pbtn" onClick={next} disabled={!ready}><SkipForward size={16} /></button>
            </div>

            <div className="mn2__player-prog">
              <span className="mn2__player-time">{fmt(currentTime)}</span>
              <div className="mn2__player-bar" onClick={seek}>
                <div className="mn2__player-fill" ref={progRef} />
              </div>
              <span className="mn2__player-time">{fmt(duration)}</span>
            </div>

            <div className="mn2__player-vol">
              <button type="button" className="mn2__pbtn mn2__pbtn--sm" onClick={() => setMuted(!muted)}>
                {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); if (muted) setMuted(false); }} className="mn2__player-vol-slider" />
            </div>
          </div>
        </div>

        <p className="mn2__sig">Nuh Demir</p>
      </section>

      <iframe ref={iframeRef} title="SC" src={buildUrl()} allow="autoplay" style={{ position:"fixed",left:-9999,top:0,width:1,height:1,opacity:0,pointerEvents:"none",border:0 }} />
    </>
  );
};

export default MainV2;
