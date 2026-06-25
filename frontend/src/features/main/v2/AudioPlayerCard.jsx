import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from "lucide-react";
import { gsap } from "gsap";

const SOUNDCLOUD_PLAYLIST_URL = "https://soundcloud.com/nuh-demir-210070335/sets/playlist";
const SOUNDCLOUD_WIDGET_SCRIPT = "https://w.soundcloud.com/player/api.js";

const loadWidgetScript = () => {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  return new Promise((resolve, reject) => {
    if (window.SC?.Widget) { resolve(window.SC); return; }
    const existing = document.querySelector(`script[src="${SOUNDCLOUD_WIDGET_SCRIPT}"]`);
    if (existing && !existing.crossOrigin) {
      const onLoad = () => { resolve(window.SC); };
      existing.addEventListener("load", onLoad, { once: true });
      if (existing.readyState === "loaded" || existing.readyState === "complete") onLoad();
      return;
    }
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.src = SOUNDCLOUD_WIDGET_SCRIPT;
    script.async = true;
    script.onload = () => setTimeout(() => resolve(window.SC), 100);
    script.onerror = () => reject(new Error("Widget script failed"));
    document.head.appendChild(script);
  });
};

const buildPlayerUrl = () => {
  const q = new URLSearchParams({
    url: SOUNDCLOUD_PLAYLIST_URL,
    auto_play: "true",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    visual: "false",
    buying: "false",
    sharing: "false",
    download: "false",
  });
  return `https://w.soundcloud.com/player/?${q.toString()}`;
};

const formatTime = (time) => {
  if (isNaN(time) || time <= 0) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const AudioPlayerCard = forwardRef(({ onIsPlayingChange }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isWidgetError, setIsWidgetError] = useState(false);

  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const progressRef = useRef(null);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from(root, { y: 48, autoAlpha: 0, duration: 0.65, ease: "power3.out", clearProps: "transform" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const refreshTrack = useCallback((widget) => {
    widget.getCurrentSound((sound) => {
      if (sound) setCurrentTrack({ title: sound.title, permalink: sound.permalink_url, artwork: sound.artwork_url });
    });
    widget.getCurrentSoundIndex((idx) => {
      if (typeof idx === "number") setCurrentIndex(idx);
    });
  }, []);

  const loadPlaylist = useCallback((widget) => {
    widget.getSounds((sounds) => {
      if (Array.isArray(sounds) && sounds.length) {
        setPlaylist(sounds.map((s) => ({
          title: s.title,
          duration: s.duration,
          artwork: s.artwork_url || null,
        })));
      }
    });
  }, []);

  useEffect(() => {
    let unmounted = false;

    const init = async () => {
      try {
        const sc = await loadWidgetScript();
        if (unmounted || !iframeRef.current) return;

        const widget = sc.Widget(iframeRef.current);
        widgetRef.current = widget;

        widget.bind(sc.Widget.Events.READY, () => {
          if (unmounted) return;
          setIsWidgetReady(true);
          widget.getDuration((d) => setDuration((d || 0) / 1000));
          widget.getCurrentSound((s) => {
            if (s) setCurrentTrack({ title: s.title, permalink: s.permalink_url, artwork: s.artwork_url });
          });
          widget.getCurrentSoundIndex((idx) => {
            if (typeof idx === "number") setCurrentIndex(idx);
          });
          loadPlaylist(widget);
          widget.play();
          setIsPlaying(true);
          onIsPlayingChange?.(true);
        });

        widget.bind(sc.Widget.Events.PLAY, () => {
          if (unmounted) return;
          setIsPlaying(true);
          onIsPlayingChange?.(true);
          refreshTrack(widget);
        });

        widget.bind(sc.Widget.Events.PAUSE, () => {
          if (unmounted) return;
          setIsPlaying(false);
          onIsPlayingChange?.(false);
        });

        widget.bind(sc.Widget.Events.PLAY_PROGRESS, (e) => {
          if (unmounted) return;
          setCurrentTime((e?.currentPosition || 0) / 1000);
          widget.getDuration((d) => setDuration((d || 0) / 1000));
        });

        widget.bind(sc.Widget.Events.FINISH, () => refreshTrack(widget));
      } catch {
        if (!unmounted) setIsWidgetError(true);
      }
    };

    init();
    return () => { unmounted = true; };
  }, []);

  useEffect(() => {
    if (!widgetRef.current || !isWidgetReady) return;
    widgetRef.current.setVolume((isMuted ? 0 : volume) * 100);
  }, [isMuted, isWidgetReady, volume]);

  useEffect(() => {
    if (!progressRef.current || !duration) return;
    const pct = Math.min(100, Math.max(0, (currentTime / duration) * 100));
    progressRef.current.style.width = `${pct}%`;
  }, [currentTime, duration]);

  const togglePlay = () => {
    if (!widgetRef.current) return;
    isPlaying ? widgetRef.current.pause() : widgetRef.current.play();
  };

  const playNext = () => {
    if (!widgetRef.current) return;
    widgetRef.current.next();
    refreshTrack(widgetRef.current);
  };

  const playPrev = () => {
    if (!widgetRef.current) return;
    widgetRef.current.prev();
    refreshTrack(widgetRef.current);
  };

  const skipTo = (index) => {
    if (!widgetRef.current) return;
    widgetRef.current.skip(index);
    refreshTrack(widgetRef.current);
  };

  const handleSeek = (e) => {
    if (!widgetRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seek = Math.max(0, Math.min(duration, pos * duration));
    widgetRef.current.seekTo(seek * 1000);
    setCurrentTime(seek);
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (widgetRef.current) widgetRef.current.setVolume(v * 100);
    if (v > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (widgetRef.current) widgetRef.current.setVolume(next ? 0 : volume * 100);
  };

  const trackName = currentTrack?.title || "SoundCloud Playlist";
  const artworkUrl = currentTrack?.artwork;

  return (
    <div ref={rootRef} className="apc">
      <div className="apc__inner">
        <div className="apc__sidebar">
          <div className="apc__sidebar-head">
            <span className="apc__sidebar-label">Parça Listesi</span>
            <span className="apc__sidebar-count">{playlist.length} parça</span>
          </div>

          <div className="apc__list">
            {playlist.map((track, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={i}
                  type="button"
                  className={`apc__item ${isActive ? "apc__item--active" : ""} ${isActive && isPlaying ? "apc__item--playing" : ""}`}
                  onClick={() => skipTo(i)}
                >
                  <span className="apc__item-idx">
                    {isActive && isPlaying ? (
                      <span className="apc__eq"><span /><span /><span /></span>
                    ) : (
                      <span className="apc__item-num">{String(i + 1).padStart(2, "0")}</span>
                    )}
                  </span>
                  <span className="apc__item-title">{track.title}</span>
                  <span className="apc__item-dur">{formatTime(track.duration / 1000)}</span>
                </button>
              );
            })}
            {!playlist.length && (
              <p className="apc__empty">Yükleniyor...</p>
            )}
          </div>
        </div>

        <div className="apc__main">
          <div className="apc__now">
            <div className="apc__art">
              {artworkUrl ? (
                <img src={artworkUrl} alt={trackName} className="apc__art-img" />
              ) : (
                <div className="apc__art-fb"><Disc3 size={44} /></div>
              )}
            </div>
            <div className="apc__now-text">
              <span className="apc__now-label">Şu An Çalıyor</span>
              <h3 className="apc__now-name">{trackName}</h3>
            </div>
          </div>

          {isWidgetError && (
            <div className="apc__error">
              Yüklenemedi. <a href={SOUNDCLOUD_PLAYLIST_URL} target="_blank" rel="noopener noreferrer">SoundCloud</a>
            </div>
          )}

          <div className="apc__bar">
            <div className="apc__prog" onClick={handleSeek}>
              <div className="apc__prog-fill" ref={progressRef} />
            </div>
            <div className="apc__times">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="apc__ctrls">
              <button type="button" className="apc__btn" onClick={playPrev} disabled={!isWidgetReady} aria-label="Önceki">
                <SkipBack size={17} />
              </button>
              <button type="button" className="apc__btn apc__btn--play" onClick={togglePlay} disabled={!isWidgetReady} aria-label={isPlaying ? "Duraklat" : "Oynat"}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
              </button>
              <button type="button" className="apc__btn" onClick={playNext} disabled={!isWidgetReady} aria-label="Sonraki">
                <SkipForward size={17} />
              </button>
              <div className="apc__vol">
                <button type="button" className="apc__vol-btn" onClick={toggleMute} aria-label="Ses">
                  {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>
                <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="apc__vol-slider" disabled={!isWidgetReady} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        title="SoundCloud player"
        src={buildPlayerUrl()}
        allow="autoplay"
        style={{ position: "fixed", left: -10000, top: 0, width: 320, height: 166, opacity: 0.001, pointerEvents: "none", border: 0 }}
      />
    </div>
  );
});

AudioPlayerCard.displayName = "AudioPlayerCard";
export default AudioPlayerCard;
