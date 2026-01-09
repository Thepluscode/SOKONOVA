
import React, { useState, useRef } from 'react';

interface ProductVideoProps {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  className?: string;
}

const ProductVideo: React.FC<ProductVideoProps> = ({
  videoUrl,
  thumbnail,
  title = 'Product Video',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div ref={containerRef} className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnail}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
        aria-label={title}
      />

      {/* Play Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            aria-label="Play video"
          >
            <i className="ri-play-fill text-4xl text-gray-900 ml-1"></i>
          </button>
        </div>
      )}

      {/* Video Controls */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-xl`}></i>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                <i className={`${isMuted ? 'ri-volume-mute-fill' : 'ri-volume-up-fill'} text-xl`}></i>
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                <i className={`${isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Badge */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <div className="flex items-center gap-2 text-white text-sm">
          <i className="ri-video-line"></i>
          <span className="font-medium">Video</span>
        </div>
      </div>
    </div>
  );
};

export default ProductVideo;
