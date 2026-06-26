import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, List, X, Disc3 } from "lucide-react";
import { useSoundCloud } from "../../contexts/SoundCloudContext.jsx";
import { fmtTime } from "../../hooks/useSoundCloudPlayer.js";
import { useTheme } from "@core";
import "./FloatingPlayer.css";

/* ── Playlist Panel ──────────────────────────────────────────────────────── */
const PlaylistPanel = ({ playlist, index, isPlaying, skip }) => (
  <motion.div
    className="fp__playlist"
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ type: "spring", stiffness: 350, damping: 32 }}
  >
    <div className="fp__pl-head">
      <span>Parça Listesi</span>
      <span className="fp__pl-count">{playlist.length} parça</span>
    </div>
    {playlist.map((t, i) => {
      const isActive = i === index;
      return (
        <button
          key={t.id || i}
          type="button"
          className={`fp__pl-item${isActive ? " fp__pl-item--active" : ""}`}
          onClick={() => skip(i)}
        >
          <div className="fp__pl-art">
            {t.artwork_url
              ? <img src={t.artwork_url} alt="" />
              : <Disc3 size={14} />
            }
          </div>
          <span className="fp__pl-title">{t.title}</span>
          <span className="fp__pl-dur">{fmtTime((t.duration || 0) / 1000)}</span>
          {isActive && isPlaying && (
            <span className="fp__pl-eq" aria-hidden="true">
              <span /><span /><span />
            </span>
          )}
        </button>
      );
    })}
  </motion.div>
);

/* ── Expanded Bar ─────────────────────────────────────────────────────────── */
const ExpandedBar = ({ onCollapse }) => {
  const {
    isPlaying, track, playlist, index,
    currentTime, duration, volume, muted,
    ready, progRef,
    toggle, next, prev, skip, seek,
    setVolume, setMuted,
  } = useSoundCloud();

  const [showPlaylist, setShowPlaylist] = useState(false);

  const nowArt = track?.artwork_url;
  const nowName = track?.title || "SoundCloud Playlist";
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  // Close on outside click
  const barRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        onCollapse();
      }
    };
    // Delay to prevent immediate close on open
    const tid = setTimeout(() => document.addEventListener("pointerdown", handler), 200);
    return () => { clearTimeout(tid); document.removeEventListener("pointerdown", handler); };
  }, [onCollapse]);

  return (
    <div className="fp__bar-wrapper">
      <motion.div
        ref={barRef}
        className="fp__bar"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
      {/* Playlist Panel */}
      <AnimatePresence>
        {showPlaylist && playlist.length > 0 && (
          <PlaylistPanel
            key="playlist"
            playlist={playlist}
            index={index}
            isPlaying={isPlaying}
            skip={skip}
          />
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="fp__progress">
        <span className="fp__time">{fmtTime(currentTime)}</span>
        <div
          className="fp__bar-track"
          onClick={seek}
          role="slider"
          aria-label="İlerleme çubuğu"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            ref={progRef}
            className={`fp__bar-fill${isPlaying ? " fp__bar-fill--flow" : ""}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="fp__time fp__time--right">{fmtTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="fp__controls">
        {/* Album Art — 3D vinyl disk */}
        <div className={`fp__art${isPlaying ? " fp__art--spinning" : ""}`}>
          {nowArt
            ? <img src={nowArt} alt={nowName} />
            : <Disc3 size={20} />
          }
        </div>

        {/* Track Info */}
        <div className="fp__info">
          <span className="fp__label">Şu An Çalıyor</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={nowName}
              className="fp__title"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.22, 0, 0, 1] }}
            >
              {nowName}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Playback Controls */}
        <button type="button" className="fp__btn" onClick={prev} disabled={!ready} aria-label="Önceki">
          <SkipBack size={15} />
        </button>
        <button
          type="button"
          className="fp__btn fp__btn--play"
          onClick={toggle}
          disabled={!ready}
          aria-label={isPlaying ? "Duraklat" : "Oynat"}
        >
          {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
        </button>
        <button type="button" className="fp__btn" onClick={next} disabled={!ready} aria-label="Sonraki">
          <SkipForward size={15} />
        </button>

        {/* Volume — hidden on mobile via CSS */}
        <div className="fp__vol">
          <button
            type="button"
            className="fp__btn fp__btn--sm"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? "Sesi Aç" : "Sesi Kapat"}
          >
            {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="fp__vol-slider"
            aria-label="Ses Seviyesi"
          />
        </div>

        {/* Playlist toggle */}
        <button
          type="button"
          className={`fp__btn fp__btn--sm${showPlaylist ? " fp__btn--active" : ""}`}
          onClick={() => setShowPlaylist((v) => !v)}
          aria-label="Parça Listesi"
          aria-pressed={showPlaylist}
        >
          <List size={15} />
        </button>

        {/* Close — hidden on mobile via CSS */}
        <button type="button" className="fp__close" onClick={onCollapse} aria-label="Küçült">
          <X size={12} />
        </button>
      </div>
      </motion.div>
    </div>
  );
};

/* ── Collapsed: Draggable Logo Bubble ─────────────────────────────────────── */
const CollapsedBubble = ({ onExpand }) => {
  const { isPlaying } = useSoundCloud();
  const { theme } = useTheme();
  const dragControls = useDragControls();

  const dragStart = useRef({ x: 0, y: 0 });

  const logoSrc = theme === "light"
    ? "/logo/logo-portfolio.png"
    : "/logo/logo-portfolio-dark.png";

  const handlePointerDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragControls.start(e);
  };

  const handlePointerUp = (e) => {
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    // Only expand if barely moved (click, not drag)
    if (dx < 8 && dy < 8) onExpand();
  };

  return (
    <motion.div
      className="fp"
      drag
      dragConstraints={{ left: -window.innerWidth + 80, right: 0, top: -window.innerHeight + 80, bottom: 0 }}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.06}
      whileDrag={{ scale: 1.1 }}
      initial={{ opacity: 0, scale: 0.4, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.4, y: 16 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {/* Pulse ring when playing — framer motion for continuous animation */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            className="fp__bubble-pulse"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.65, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <div
        className="fp__bubble"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        title="Müzik Çaları Aç"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onExpand(); }}
        aria-label="Müzik çaları aç"
      >
        <img
          src={logoSrc}
          alt="Müzik Çalar"
          className="fp__bubble-logo"
          draggable={false}
        />
      </div>
    </motion.div>
  );
};

/* ── FloatingPlayer: Orchestrator ─────────────────────────────────────────── */
const FloatingPlayer = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {expanded ? (
        <ExpandedBar key="bar" onCollapse={() => setExpanded(false)} />
      ) : (
        <CollapsedBubble key="bubble" onExpand={() => setExpanded(true)} />
      )}
    </AnimatePresence>
  );
};

export default FloatingPlayer;
