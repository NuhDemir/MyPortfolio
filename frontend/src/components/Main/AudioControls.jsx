import React, { forwardRef, useState, useRef, useEffect } from "react";
import playSvg from "/assets/icons/play.svg";
import pauseSvg from "/assets/icons/pause.svg";
import nextSvg from "/assets/icons/next.svg";

// Option 1: Import audio files directly (preferred in React)
// import audioFile1 from "/audio/alisamadim.mp3";
// import audioFile2 from "/audio/ardina-bakma-yolcu.mp3";
// import audioFile3 from "/audio/uzun-ince-bir-yoldayim.mp3";

const AudioControls = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Option 1: Use imported audio files
  // const songs = [
  //   { file: audioFile1, name: "Alışamadım" },
  //   { file: audioFile2, name: "Ardına Bakma Yolcu" },
  //   { file: audioFile3, name: "Uzun İnce Bir Yoldayım - Aşık Veysel" },
  // ];

  // Option 2: Use public folder (using this option in the code below)
  const songs = [
    { path: "/audio/alisamadim.mp3", name: "Alışamadım" },
    { path: "/audio/ardinabakmayolcu.mp3", name: "Ardına Bakma Yolcu" },
    {
      path: "/audio/uzunincebiryoldayim.mp3",
      name: "Uzun İnce Bir Yoldayım - Aşık Veysel",
    },
  ];

  // Get the current song path
  const getCurrentSongPath = () => {
    return songs[currentSongIndex].path;
  };

  // Get the current song name
  const getCurrentSongName = () => {
    return songs[currentSongIndex].name;
  };

  // Initialize with a random song on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSongIndex(randomIndex);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();

        // Handle play promise to catch errors
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
              setIsPlaying(true);
            })
            .catch((error) => {
              // Auto-play was prevented
              console.error("Playback error:", error);
              setIsPlaying(false);
            });
          return;
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeToRandomSong = () => {
    // Make sure we don't get the same song again
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === currentSongIndex && songs.length > 1);

    setCurrentSongIndex(newIndex);
    setCurrentTime(0);
    setIsPlaying(false);

    // If we were playing, start playing the new song immediately
    if (isPlaying && audioRef.current) {
      // Need to wait for the audio element to update its src
      setTimeout(() => {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing next track:", error);
            });
        }
      }, 100);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (progressRef.current) {
        const progress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        progressRef.current.style.width = `${progress}%`;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // Reset progress bar
      if (progressRef.current) {
        progressRef.current.style.width = "0%";
      }
    }
  };

  const handleTimelineClick = (e) => {
    if (audioRef.current) {
      const timeline = e.currentTarget;
      const rect = timeline.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Add error handler for audio element
  const handleError = (e) => {
    console.error("Audio error:", e);
    console.error("Failed to load:", getCurrentSongPath());
  };

  return (
    <div ref={ref} className="audio-controls">
      <div className="soundtrack-info">
        <div className="soundtrack-label">SOUNDTRACK</div>
        <div className="song-name">{getCurrentSongName()}</div>
      </div>
      <div className="audio-player">
        <div className="controls-wrapper">
          <button className="play-button" onClick={togglePlay}>
            {isPlaying ? (
              <img src={pauseSvg} alt="Pause" width="65" height="65" />
            ) : (
              <img src={playSvg} alt="Play" width="65" height="65" />
            )}
          </button>
          <button className="next-button" onClick={changeToRandomSong}>
            <img src={nextSvg} alt="Next" width="40" height="40" />
          </button>
        </div>
        <div className="timeline" onClick={handleTimelineClick}>
          <div className="progress-bg"></div>
          <div className="progress" ref={progressRef}></div>
        </div>
        <div className="time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <audio
          ref={audioRef}
          src={getCurrentSongPath()}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          onEnded={() => {
            setIsPlaying(false);
            // Optionally, play the next song automatically
            // changeToRandomSong();
          }}
        />
      </div>
    </div>
  );
});

export default AudioControls;
