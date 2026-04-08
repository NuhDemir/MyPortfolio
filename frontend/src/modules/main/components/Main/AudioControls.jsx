import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react";

const SONGS = [
  { path: "/audio/alisamadim.mp3", name: "Alışamadım" },
  { path: "/audio/ardinabakmayolcu.mp3", name: "Ardına Bakma Yolcu" },
  {
    path: "/audio/uzunincebiryoldayim.mp3",
    name: "Uzun İnce Bir Yoldayım",
  },
];

const AudioControls = forwardRef(
  ({ onIsPlayingChange, onAudioDataChange }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);
    const animationFrameRef = useRef(null);

    const setupAudioContext = useCallback(() => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
      }
      if (audioRef.current && !sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(
          audioRef.current,
        );
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    }, []);

    useEffect(() => {
      const randomIndex = Math.floor(Math.random() * SONGS.length);
      setCurrentSongIndex(randomIndex);
    }, []);

    const analyzeAudio = useCallback(() => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        onAudioDataChange([...dataArrayRef.current]);
      }
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }, [onAudioDataChange]);

    const togglePlay = async () => {
      setupAudioContext();
      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume();
      }

      const newIsPlaying = !isPlaying;
      setIsPlaying(newIsPlaying);
      onIsPlayingChange(newIsPlaying);

      if (newIsPlaying) {
        await audioRef.current.play();
        analyzeAudio();
      } else {
        audioRef.current.pause();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };

    const changeToRandomSong = () => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * SONGS.length);
      } while (newIndex === currentSongIndex && SONGS.length > 1);
      setCurrentSongIndex(newIndex);
      setCurrentTime(0);
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onIsPlayingChange(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
      setTimeout(() => {
        if (wasPlaying) {
          togglePlay();
        }
      }, 150);
    };

    const handleVolumeChange = (e) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) audioRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) setIsMuted(false);
    };

    const toggleMute = () => {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume;
    };

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime);
      if (progressRef.current && audioRef.current.duration) {
        const progress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        progressRef.current.style.width = `${progress}%`;
      }
    };

    const handleLoadedMetadata = () => {
      if (!audioRef.current) return;
      setDuration(audioRef.current.duration);
      audioRef.current.volume = isMuted ? 0 : volume;
    };

    const handleTimelineClick = (e) => {
      if (!audioRef.current || !audioRef.current.duration) return;
      const timeline = e.currentTarget;
      const rect = timeline.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    };

    const formatTime = (time) => {
      if (isNaN(time) || time === 0) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
      <div ref={ref} className="audio-controls">
        <div className="soundtrack-info">
          <div className="soundtrack-label">SOUNDTRACK</div>
          <div className="song-name">{SONGS[currentSongIndex].name}</div>
        </div>
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
              onClick={changeToRandomSong}
              aria-label="Sonraki rastgele şarkıya geç"
            >
              <SkipForward size={24} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="control-button play-button"
              onClick={togglePlay}
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
              />
            </div>
          </div>
          <audio
            ref={audioRef}
            src={SONGS[currentSongIndex].path}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={changeToRandomSong}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    );
  },
);

export default AudioControls;
