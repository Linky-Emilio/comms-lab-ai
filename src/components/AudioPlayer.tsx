import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader2, AlertTriangle } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface AudioPlayerProps {
  userId: string;
  analysisId: string;
  audioType: 'player' | 'coach';
  onDurationChange?: (duration: number) => void;
  showPlayer?: boolean;
  label?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  userId, 
  analysisId, 
  audioType, 
  onDurationChange,
  showPlayer = true,
  label = "Play Audio"
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchAudioUrl = async () => {
    if (!userId || !analysisId) {
      setError("Missing user or analysis ID.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const filename = `${audioType}_${analysisId}.mp3`;
      const apiUrl = `https://9a8ffdc0453d.ngrok-free.app/get-audio-url?user_id=${userId}&filename=${filename}`;
      
      const res = await fetch(apiUrl, {
        credentials: 'include',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Server returned an unexpected response.' }));
        throw new Error(`Failed to get audio URL: ${res.statusText} - ${errorData.message}`);
      }

      const data = await res.json();
      if (data.url) {
        setAudioUrl(data.url);
      } else {
        throw new Error("URL not found in response");
      }
    } catch (e: any) {
      console.error('Error fetching signed URL:', e);
      setError(e.message || "Failed to load audio.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      const newDuration = audio.duration;
      setDuration(newDuration);
      if (onDurationChange) {
        onDurationChange(newDuration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
    };
  }, [audioUrl, onDurationChange]);

  const handlePlayPause = () => {
    if (!audioUrl) {
      fetchAudioUrl();
      return;
    }
    
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-destructive text-xs">
        <AlertTriangle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={handlePlayPause} variant="outline" size="icon" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      {showPlayer && (
        <div>
          <span className="text-sm font-medium">{label}</span>
          {duration > 0 && (
            <span className="text-xs text-muted-foreground ml-2">{formatTime(duration)}</span>
          )}
        </div>
      )}
      {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" autoPlay={isPlaying} />}
    </div>
  );
};

export default AudioPlayer;
