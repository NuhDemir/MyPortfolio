import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react";
import { gsap } from "gsap";
import { PatternBackground } from "@shared/ui/patterns";

const SOUNDCLOUD_PLAYLIST_URL =
  "https://soundcloud.com/nuh-demir-210070335/sets/playlist";
const SOUNDCLOUD_WIDGET_SCRIPT = "https://w.soundcloud.com/player/api.js";

const formatSoundCloudTitle = (title) => {
  if (!title) {
    return "SoundCloud Playlist";
  }
  return title.length > 42 ? `${title.slice(0, 39)}...` : title;
};

const loadSoundCloudWidgetScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available"));
  }

  return new Promise((resolve, reject) => {
    if (window.SC?.Widget && typeof window.SC.Widget === "function") {
      resolve(window.SC);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${SOUNDCLOUD_WIDGET_SCRIPT}"]`,
    );

    if (existingScript) {
      // If a previous build injected crossorigin, recreate the script without it.
      if (existingScript.crossOrigin) {
        existingScript.remove();
      } else {
        let loadHandler = null;
        let errorHandler = null;

        const cleanup = () => {
          if (loadHandler) {
            existingScript.removeEventListener("load", loadHandler);
          }
          if (errorHandler) {
            existingScript.removeEventListener("error", errorHandler);
          }
        };

        loadHandler = () => {
          cleanup();
          if (window.SC?.Widget) {
            resolve(window.SC);
          } else {
            reject(new Error("SC Widget not available after script load"));
          }
        };

        errorHandler = () => {
          cleanup();
          reject(new Error("SoundCloud widget script failed to load"));
        };

        existingScript.addEventListener("load", loadHandler, { once: false });
        existingScript.addEventListener("error", errorHandler, { once: false });

        if (
          existingScript.readyState === "loaded" ||
          existingScript.readyState === "complete"
        ) {
          loadHandler();
        }
        return;
      }
    }

    const script = document.createElement("script");
    script.src = SOUNDCLOUD_WIDGET_SCRIPT;
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.SC?.Widget && typeof window.SC.Widget === "function") {
          resolve(window.SC);
        } else {
          reject(new Error("SC Widget not initialized properly"));
        }
      }, 100);
    };
    script.onerror = () =>
      reject(new Error("SoundCloud widget script network error"));
    document.head.appendChild(script);
  });
};

const buildSoundCloudPlayerUrl = () => {
  const query = new URLSearchParams({
    url: SOUNDCLOUD_PLAYLIST_URL,
    auto_play: "true",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
    buying: "false",
    sharing: "false",
    download: "false",
  });

  return `https://w.soundcloud.com/player/?${query.toString()}`;
};

const AudioControls = forwardRef(
  ({ onIsPlayingChange, onAudioDataChange }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSongName, setCurrentSongName] = useState(
      "SoundCloud Playlist",
    );
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isWidgetReady, setIsWidgetReady] = useState(false);
    const [isWidgetError, setIsWidgetError] = useState(false);

    const iframeRef = useRef(null);
    const widgetRef = useRef(null);
    const progressRef = useRef(null);
    const controlsRootRef = useRef(null);

    const setControlsRef = (node) => {
      controlsRootRef.current = node;

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    };

    useLayoutEffect(() => {
      const rootNode = controlsRootRef.current;
      if (!rootNode) {
        return undefined;
      }

      const context = gsap.context(() => {
        const soundtrackInfo = rootNode.querySelector(".soundtrack-info");
        const soundtrackLabel = rootNode.querySelector(".soundtrack-label");
        const songName = rootNode.querySelector(".song-name");
        const timelineContainer = rootNode.querySelector(".timeline-container");
        const controlsWrapper = rootNode.querySelector(".controls-wrapper");
        const fallbackBox = rootNode.querySelector(".widget-error-fallback");
        const controlButtons = rootNode.querySelectorAll(".control-button");
        const volumeSlider = rootNode.querySelector(".volume-slider");
        const timeDisplays = rootNode.querySelectorAll(".time-display");

        gsap.set(rootNode, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          filter: "none",
        });

        const introTimeline = gsap.timeline({
          defaults: {
            immediateRender: false,
          },
        });

        introTimeline
          .from(rootNode, {
            y: 64,
            autoAlpha: 0,
            rotate: 1.4,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          })
          .from(
            soundtrackInfo,
            {
              y: 20,
              autoAlpha: 0,
              duration: 0.42,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
            },
            "-=0.42",
          )
          .from(
            [soundtrackLabel, songName],
            {
              y: 8,
              autoAlpha: 0,
              stagger: 0.06,
              duration: 0.28,
              ease: "power1.out",
              clearProps: "opacity,visibility,transform",
            },
            "-=0.22",
          )
          .from(
            timelineContainer,
            {
              autoAlpha: 0,
              scaleX: 0.32,
              transformOrigin: "left center",
              duration: 0.44,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
            },
            "-=0.15",
          )
          .from(
            timeDisplays,
            {
              autoAlpha: 0,
              y: 7,
              stagger: 0.05,
              duration: 0.24,
              ease: "power1.out",
              clearProps: "opacity,visibility,transform",
            },
            "-=0.35",
          )
          .from(
            controlsWrapper,
            {
              autoAlpha: 0,
              y: 18,
              duration: 0.34,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
            },
            "-=0.2",
          )
          .from(
            [...controlButtons, volumeSlider].filter(Boolean),
            {
              autoAlpha: 0,
              y: 12,
              scale: 0.74,
              stagger: {
                each: 0.045,
                from: "center",
              },
              duration: 0.4,
              ease: "back.out(1.7)",
              clearProps: "opacity,visibility,transform",
            },
            "-=0.2",
          )
          .from(
            fallbackBox,
            {
              autoAlpha: 0,
              y: 14,
              duration: 0.34,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
            },
            "<",
          );
      }, controlsRootRef);

      return () => {
        context.revert();
      };
    }, []);

    useEffect(() => {
      onAudioDataChange(null);
      let isUnmounted = false;

      const initializeWidget = async () => {
        try {
          const sc = await loadSoundCloudWidgetScript();
          if (isUnmounted) {
            return;
          }

          if (!iframeRef.current || !iframeRef.current.ownerDocument) {
            throw new Error("Iframe not mounted in DOM");
          }

          if (!sc?.Widget || typeof sc.Widget !== "function") {
            throw new Error("SC Widget API not available");
          }

          let widget;
          try {
            widget = sc.Widget(iframeRef.current);
          } catch (err) {
            throw new Error(`Widget initialization error: ${err?.message}`)
          }

          if (!widget) {
            throw new Error("Widget instance not created");
          }

          widgetRef.current = widget;

          const handleReady = () => {
            if (isUnmounted) {
              return;
            }

            setIsWidgetReady(true);
            widget.getDuration((durationMs) => {
              setDuration((durationMs || 0) / 1000);
            });
            widget.getCurrentSound((sound) => {
              setCurrentSongName(formatSoundCloudTitle(sound?.title));
            });
            widget.play();
            setIsPlaying(true);
            onIsPlayingChange(true);
          };

          const handlePlay = () => {
            if (isUnmounted) {
              return;
            }
            setIsPlaying(true);
            onIsPlayingChange(true);
          };

          const handlePause = () => {
            if (isUnmounted) {
              return;
            }
            setIsPlaying(false);
            onIsPlayingChange(false);
          };

          const handlePlayProgress = (event) => {
            if (isUnmounted) {
              return;
            }

            setCurrentTime((event?.currentPosition || 0) / 1000);
            widget.getDuration((durationMs) => {
              setDuration((durationMs || 0) / 1000);
            });
          };

          const refreshCurrentTrack = () => {
            widget.getCurrentSound((sound) => {
              if (isUnmounted) {
                return;
              }
              setCurrentSongName(formatSoundCloudTitle(sound?.title));
            });
          };

          widget.bind(sc.Widget.Events.READY, handleReady);
          widget.bind(sc.Widget.Events.PLAY, handlePlay);
          widget.bind(sc.Widget.Events.PAUSE, handlePause);
          widget.bind(sc.Widget.Events.PLAY_PROGRESS, handlePlayProgress);
          widget.bind(sc.Widget.Events.FINISH, refreshCurrentTrack);

          if (isUnmounted) {
            widget.unbind(sc.Widget.Events.READY);
            widget.unbind(sc.Widget.Events.PLAY);
            widget.unbind(sc.Widget.Events.PAUSE);
            widget.unbind(sc.Widget.Events.PLAY_PROGRESS);
            widget.unbind(sc.Widget.Events.FINISH);
          }
        } catch (error) {
          if (!isUnmounted) {
            // Suppress CORS errors - they're expected due to SoundCloud API restrictions
            // but don't require user action
            const isCORSError = error?.message?.includes("script") || 
                                error?.message?.includes("load");
            
            if (!isCORSError) {
              console.error("SoundCloud widget init failed:", {
                message: error?.message,
                stack: error?.stack,
                iframeRef: !!iframeRef.current,
                SC: !!window.SC,
              });
            }
            
            setIsWidgetError(true);
            setIsWidgetReady(false);
          }
        }
      };

      initializeWidget();

      return () => {
        isUnmounted = true;
        setIsPlaying(false);
        onIsPlayingChange(false);
      };
    }, [onAudioDataChange, onIsPlayingChange]);

    useEffect(() => {
      if (!widgetRef.current || !isWidgetReady) {
        return;
      }

      widgetRef.current.setVolume((isMuted ? 0 : volume) * 100);
    }, [isMuted, isWidgetReady, volume]);

    const togglePlay = () => {
      if (!isWidgetReady || !widgetRef.current) {
        return;
      }

      if (isPlaying) {
        widgetRef.current.pause();
      } else {
        widgetRef.current.play();
      }
    };

    const playNextTrack = () => {
      if (!isWidgetReady || !widgetRef.current) {
        return;
      }

      widgetRef.current.next();
      widgetRef.current.getCurrentSound((sound) => {
        setCurrentSongName(formatSoundCloudTitle(sound?.title));
      });
    };

    const handleVolumeChange = (e) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (widgetRef.current) {
        widgetRef.current.setVolume(newVolume * 100);
      }
      if (newVolume > 0 && isMuted) setIsMuted(false);
    };

    const toggleMute = () => {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      if (widgetRef.current) {
        widgetRef.current.setVolume(newMutedState ? 0 : volume * 100);
      }
    };

    const handleTimelineClick = (e) => {
      if (!widgetRef.current || !duration) return;
      const timeline = e.currentTarget;
      const rect = timeline.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const seekToSeconds = Math.max(0, Math.min(duration, pos * duration));
      widgetRef.current.seekTo(seekToSeconds * 1000);
      setCurrentTime(seekToSeconds);
    };

    useEffect(() => {
      if (!progressRef.current || !duration) {
        return;
      }

      const progress = (currentTime / duration) * 100;
      progressRef.current.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }, [currentTime, duration]);

    const formatTime = (time) => {
      if (isNaN(time) || time === 0) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
      <div ref={setControlsRef} className="audio-controls">
        <PatternBackground
          variant="naiveSketch"
          opacity={0.26}
          className="audio-controls-pattern"
          seed="audio-controls-naive"
        />
        <div className="soundtrack-info">
          <div className="soundtrack-label">SARKILARIM</div>
          <div className="song-name">{currentSongName}</div>
        </div>

        {isWidgetError && (
          <div className="widget-error-fallback">
            <p className="error-message">
              Müzik oynatıcı yüklenemedi. Lütfen{" "}
              <a
                href={SOUNDCLOUD_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="fallback-link"
              >
                SoundCloud'ta dinle
              </a>
            </p>
          </div>
        )}

        <div className="audio-player">
          {/* Zaman Göstergesi ve Zaman Çubuğu */}
          <div className="timeline-container">
            <div className="time-display">{formatTime(currentTime)}</div>
            <div className="timeline" onClick={handleTimelineClick}>
              <div className="progress" ref={progressRef}></div>
            </div>
            <div className="time-display">{formatTime(duration)}</div>
          </div>

          {/* Kontrol Butonları */}
          <div className="controls-wrapper">
            <button
              type="button"
              className="control-button"
              onClick={playNextTrack}
              aria-label="Sonraki şarkıya geç"
              disabled={!isWidgetReady}
            >
              <SkipForward size={24} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="control-button play-button"
              onClick={togglePlay}
              disabled={!isWidgetReady}
              aria-label={isPlaying ? "Müziği duraklat" : "Müziği oynat"}
            >
              {isPlaying ? (
                <Pause size={28} strokeWidth={2} />
              ) : (
                <Play size={28} strokeWidth={2} />
              )}
            </button>
            <div className="volume-control">
              <button
                type="button"
                className="control-button volume-button"
                onClick={toggleMute}
                aria-label={isMuted || volume === 0 ? "Sesi aç" : "Sesi kapat"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={22} strokeWidth={2} />
                ) : (
                  <Volume2 size={22} strokeWidth={2} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                disabled={!isWidgetReady}
              />
            </div>
          </div>
          <iframe
            ref={iframeRef}
            title="SoundCloud playlist player"
            src={buildSoundCloudPlayerUrl()}
            allow="autoplay"
            style={{
              position: "fixed",
              left: -10000,
              top: 0,
              width: 320,
              height: 166,
              opacity: 0.001,
              pointerEvents: "none",
              border: 0,
            }}
          />
        </div>
      </div>
    );
  },
);

export default AudioControls;
