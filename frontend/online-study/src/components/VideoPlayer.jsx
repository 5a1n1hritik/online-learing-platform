import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import videothumbnail from "@/assets/videothumbnail.png";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const VideoPlayer = ({ videoSrc, isExternal = false }) => {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate video loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (value) => {
    if (!videoRef.current) return;
    const vol = value[0];
    videoRef.current.volume = vol / 100;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const handleProgressChange = (value) => {
    if (!videoRef.current) return;
    const time = (value[0] / 100) * duration;
    videoRef.current.currentTime = time;
    setProgress(value[0]);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(current);
    setDuration(dur);
    setProgress((current / dur) * 100);
  };

  const skipTime = (amount) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += amount;
  };

  return (
    <div
      className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Video Element */}
      {isExternal ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={videoSrc}
          title="Video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          poster={videothumbnail}
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => setIsLoaded(true)}
        >
          {/* Fallback video formats */}
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc} type="video/webm" />
          <source src={videoSrc} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        {!isPlaying && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30 border-white/20 animate-pulse-soft"
              onClick={togglePlay}
            >
              <Play className="h-8 w-8 text-white" />
            </Button>
          </div>
        )}
      </div>

      {/* Video Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-all duration-300",
          isPlaying && !isHovering ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="space-y-2">
          <Slider
            value={[progress]}
            max={100}
            step={1}
            className="h-1 progress-bar-animated"
            onValueChange={handleProgressChange}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 transition-all"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 transition-all"
                onClick={() => skipTime(-10)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 transition-all"
                onClick={() => skipTime(10)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20 transition-all"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  className="w-20 h-1"
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 transition-all"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
