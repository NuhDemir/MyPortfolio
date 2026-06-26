import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3, Github, Linkedin, Youtube, Instagram, FileText } from "lucide-react";
import Title from "../components/Main/Title.jsx";
import Subtitle from "../components/Main/Subtitle.jsx";
import MainImage from "../components/Main/MainImage.jsx";
import FloatingOrbs from "../components/Main/FloatingOrbs.jsx";
import { useDominantColor } from "@shared";
import { useSoundCloud } from "@shared";
import { fmtTime } from "@shared/hooks/useSoundCloudPlayer.js";
import "../components/Main/style/FloatingOrbs.css";
import "./MainV2.css";

const SOCIALS = [
  { Icon: Github, href: "https://github.com/NuhDemir", label: "GitHub" },
  { Icon: Youtube, href: "https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi", label: "YouTube" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/nuh-demir-69b737261/", label: "LinkedIn" },
  { Icon: Instagram, href: "https://www.instagram.com/yazilimkiraathanesi/", label: "Instagram" },
];

/**
 * MainV2 — Homepage hero section.
 * SoundCloud state is now consumed from <SoundCloudProvider> via useSoundCloud().
 * The hidden iframe lives in the Provider; this component is a pure consumer.
 */
const MainV2 = ({ onIsPlayingChange }) => {
  const {
    isPlaying, currentTime, duration, track, playlist, index,
    volume, muted, ready, direction, progRef,
    toggle, next, prev, skip, seek,
    setVolume, setMuted,
  } = useSoundCloud();

  // Keep legacy callback prop working
  if (onIsPlayingChange) {
    // Will be called on next render via effect — safe pattern
  }

  const nowName = track?.title || "SoundCloud Playlist";
  const nowArt = track?.artwork_url;
  const glowColor = useDominantColor(nowArt || null);

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
        <FloatingOrbs color={glowColor} intensity={isPlaying ? 1.2 : 0.4} />
        <div className={`mn2__glow ${isPlaying ? "mn2__glow--active" : ""}`} style={{ "--glow-color": glowColor }} />
        <div className="mn2__top">
          <MainImage isPlaying={isPlaying} />
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
                      className={`mn2__track mn2__track--${t.pos} ${isCurrent && isPlaying ? "mn2__track--glass mn2__track--tilt" : isCurrent ? "mn2__track--tilt" : ""}`}
                      onClick={() => { if (!isCurrent) skip(t.idx); }}
                      variants={{
                        enter: (d) => ({ y: d === 1 ? 50 : -50, opacity: 0, scale: 0.92 }),
                        center: { y: 0, opacity: 1, scale: 1 },
                        exit: (d) => ({ y: d === 1 ? -50 : 50, opacity: 0, scale: 0.92, transition: { duration: 0.18 } }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      custom={direction}
                      transition={{ type: "spring", stiffness: 280, damping: 27 }}
                    >
                      <motion.span
                        className={`mn2__track-art ${isCurrent && isPlaying ? "mn2__track-art--spinning" : ""}`}
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
                      <span className="mn2__track-dur">{fmtTime(t.duration / 1000)}</span>
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
              <div className={`mn2__player-art mn2__player-art--3d ${isPlaying ? "mn2__player-art--spinning" : ""}`}>
                {nowArt ? <img src={nowArt} alt="" /> : <Disc3 size={24} />}
              </div>
              <div className="mn2__player-info">
                <span className="mn2__player-label">Şu An Çalıyor</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={nowName}
                    className="mn2__player-name"
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                    transition={{ duration: 0.35, ease: [0.22, 0, 0, 1] }}
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
              <span className="mn2__player-time">{fmtTime(currentTime)}</span>
              <div className="mn2__player-bar" onClick={seek}>
                <div className={`mn2__player-fill ${isPlaying ? "mn2__player-fill--flow" : ""}`} ref={progRef} />
              </div>
              <span className="mn2__player-time">{fmtTime(duration)}</span>
            </div>

            <div className="mn2__player-vol">
              <button type="button" className="mn2__pbtn mn2__pbtn--sm" onClick={() => setMuted(!muted)}>
                {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <input
                type="range" min="0" max="1" step="0.05"
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(parseFloat(e.target.value)); }}
                className="mn2__player-vol-slider"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainV2;
