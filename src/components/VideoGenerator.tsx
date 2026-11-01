import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Video,
  Play,
  Square,
  Download,
  Film,
  RefreshCw,
  Sparkles,
  Layers,
  Subtitles,
  Smartphone,
  Monitor,
  Edit3,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { CampaignBrief, VideoData, VideoScene } from '../types';

interface VideoGeneratorProps {
  brief: CampaignBrief;
  video: VideoData;
  onUpdateVideo: (updated: VideoData) => void;
  onRegenerate: (instructions?: string) => void;
  isRegenerating: boolean;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  brief,
  video,
  onUpdateVideo,
  onRegenerate,
  isRegenerating,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeTab, setActiveTab] = useState<'player' | 'storyboard'>('player');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const totalDuration = video.totalDurationSeconds || 15;

  // Render Scene Frame onto Canvas
  const renderFrame = useCallback(
    (timeInSeconds: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isVertical = aspectRatio === '9:16';
      const width = isVertical ? 720 : 1280;
      const height = isVertical ? 1280 : 720;

      canvas.width = width;
      canvas.height = height;

      // Determine active scene based on cumulative time
      let accumulatedTime = 0;
      let activeIndex = 0;
      for (let i = 0; i < video.scenes.length; i++) {
        const dur = video.scenes[i].duration;
        if (timeInSeconds >= accumulatedTime && timeInSeconds < accumulatedTime + dur) {
          activeIndex = i;
          break;
        }
        accumulatedTime += dur;
      }
      if (timeInSeconds >= totalDuration) {
        activeIndex = video.scenes.length - 1;
      }
      setCurrentSceneIndex(activeIndex);

      const scene = video.scenes[activeIndex] || video.scenes[0];
      const sceneTime = timeInSeconds - accumulatedTime;
      const sceneProgress = Math.min(1, Math.max(0, sceneTime / (scene.duration || 3)));

      const pColor = brief.primaryColor || '#6366f1';
      const sColor = brief.secondaryColor || '#3b82f6';
      const aColor = brief.accentColor || '#ec4899';

      // 1. Dynamic Motion Background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, width, height);

      // Animated ambient gradient light rays
      const pulseX = width * 0.5 + Math.sin(timeInSeconds * 1.5) * 120;
      const pulseY = height * 0.45 + Math.cos(timeInSeconds * 1.2) * 80;

      const bgGrad = ctx.createRadialGradient(pulseX, pulseY, 20, pulseX, pulseY, width * 0.75);
      bgGrad.addColorStop(0, (activeIndex % 2 === 0 ? pColor : sColor) + '88');
      bgGrad.addColorStop(0.5, aColor + '33');
      bgGrad.addColorStop(1, '#00000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Kinetic particles
      ctx.fillStyle = '#ffffff25';
      for (let i = 0; i < 24; i++) {
        const px = (Math.sin(i * 99 + timeInSeconds * 0.4) * 0.5 + 0.5) * width;
        const py = (Math.cos(i * 33 + timeInSeconds * 0.3) * 0.5 + 0.5) * height;
        const radius = (Math.sin(i + timeInSeconds) * 0.5 + 1) * 3;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Scene Visual Card / Centerpiece
      const centerX = width * 0.5;
      const centerY = height * 0.45;

      // Draw dynamic visual element matching scene title
      ctx.save();
      // Zoom or Pulse transition
      const scale = 1 + Math.sin(sceneProgress * Math.PI) * 0.08;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);

      // Visual backdrop box
      const boxW = width * (isVertical ? 0.78 : 0.65);
      const boxH = height * (isVertical ? 0.42 : 0.5);

      ctx.fillStyle = '#0f172aee';
      ctx.strokeStyle = pColor + '99';
      ctx.lineWidth = 3;
      ctx.shadowColor = aColor;
      ctx.shadowBlur = 30;

      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 24);
      ctx.fill();
      ctx.stroke();

      // Scene Title Tag inside card
      ctx.fillStyle = aColor;
      ctx.font = `bold ${Math.round(width * 0.026)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`SCENE ${scene.sceneNumber}: ${scene.title.toUpperCase()}`, 0, -boxH / 2 + 45);

      // Product / Brand Hero Silhouette
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${Math.round(width * 0.048)}px 'Space Grotesk', sans-serif`;
      ctx.fillText(brief.productName, 0, -20);

      // Visual Description snippet
      ctx.fillStyle = '#94a3b8';
      ctx.font = `400 ${Math.round(width * 0.024)}px 'Plus Jakarta Sans', sans-serif`;
      const descSnippet = scene.visualDescription.slice(0, 90) + '...';
      ctx.fillText(descSnippet, 0, 35);

      ctx.restore();

      // 3. Brand Top Bar Overlay
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(width * 0.03)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillText(brief.brandName.toUpperCase(), 40, 40);

      ctx.textAlign = 'right';
      ctx.fillStyle = aColor;
      ctx.font = `600 ${Math.round(width * 0.024)}px 'Space Grotesk', sans-serif`;
      ctx.fillText(`${timeInSeconds.toFixed(1)}s / ${totalDuration}s`, width - 40, 40);

      // 4. Subtitles & On-Screen Kinetic Captions
      if (showSubtitles) {
        const subY = height * (isVertical ? 0.76 : 0.80);

        // Subtitle background pill
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Headline On-Screen Text
        ctx.font = `800 ${Math.round(width * 0.042)}px 'Space Grotesk', sans-serif`;
        const textMetrics = ctx.measureText(scene.onScreenText);
        const pillW = textMetrics.width + 48;
        const pillH = Math.round(width * 0.075);

        ctx.fillStyle = '#000000cc';
        ctx.beginPath();
        ctx.roundRect(centerX - pillW / 2, subY - pillH / 2, pillW, pillH, 14);
        ctx.fill();

        ctx.strokeStyle = aColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(scene.onScreenText, centerX, subY);

        // Spoken Voiceover Narration Subtitle below
        const voY = subY + pillH / 2 + 35;
        ctx.font = `500 ${Math.round(width * 0.026)}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`🎙️ "${scene.voiceover}"`, centerX, voY);
      }

      // 5. Bottom Progress Bar
      const progress = Math.min(1, timeInSeconds / totalDuration);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, height - 10, width, 10);

      const barGrad = ctx.createLinearGradient(0, 0, width, 0);
      barGrad.addColorStop(0, pColor);
      barGrad.addColorStop(0.5, aColor);
      barGrad.addColorStop(1, sColor);
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, height - 10, width * progress, 10);
    },
    [aspectRatio, brief, video, showSubtitles, totalDuration]
  );

  // Playback Loop
  const playLoop = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setPlaybackTime(elapsed);
    renderFrame(elapsed);

    if (elapsed >= totalDuration) {
      setIsPlaying(false);
      setPlaybackTime(0);
      renderFrame(0);
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      animFrameRef.current = requestAnimationFrame(playLoop);
    }
  }, [totalDuration, renderFrame, isRecording]);

  useEffect(() => {
    renderFrame(playbackTime);
  }, [renderFrame, playbackTime]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startTimeRef.current = Date.now() - playbackTime * 1000;
      animFrameRef.current = requestAnimationFrame(playLoop);
    }
  };

  const handleRestart = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setPlaybackTime(0);
    renderFrame(0);
    setIsPlaying(false);
  };

  // Real WebM Video Export via MediaRecorder
  const handleRecordAndDownloadVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      });

      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brief.brandName}_${brief.productName}_reel_${aspectRatio.replace(':', 'x')}.webm`.replace(
          /\s+/g,
          '_'
        );
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      // Start playback from 0
      setPlaybackTime(0);
      startTimeRef.current = Date.now();
      setIsPlaying(true);
      animFrameRef.current = requestAnimationFrame(playLoop);
    } catch (err) {
      console.error('Error recording canvas video:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>AI Short Video & Storyboard Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            Short Promotional Video Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time interactive kinetic player with scene-by-scene script, subtitles & WebM video export
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRecordAndDownloadVideo}
            disabled={isRecording}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isRecording ? 'Recording Reel...' : 'Export Video Reel (WebM)'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Video Player Viewport (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">{video.title}</span>
              {isRecording && (
                <span className="flex items-center gap-1 text-rose-400 font-bold animate-pulse text-[10px] bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> REC
                </span>
              )}
            </div>

            {/* Aspect Ratio Toggle */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`p-1.5 rounded transition cursor-pointer ${
                  aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vertical Reel (9:16)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`p-1.5 rounded transition cursor-pointer ${
                  aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Landscape Web (16:9)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Canvas Video Render */}
          <div className="w-full flex justify-center py-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              className={`rounded-xl shadow-2xl border border-slate-800 object-contain transition-all ${
                aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[480px]' : 'aspect-[16/9] w-full max-h-[360px]'
              }`}
            />
          </div>

          {/* Player Controls Bar */}
          <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
              >
                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={handleRestart}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                Restart
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              {playbackTime.toFixed(1)}s / {totalDuration}s
            </div>

            {/* Subtitles Toggle */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition cursor-pointer ${
                showSubtitles
                  ? 'bg-purple-950/40 border-purple-500/60 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Captions</span>
            </button>
          </div>
        </div>

        {/* Right: Scene-by-Scene Storyboard & Script (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white text-base">Scene Storyboard</h3>
            </div>
            <span className="text-xs text-slate-400">
              {video.scenes.length} Scenes • Voice: {video.voiceoverStyle}
            </span>
          </div>

          {/* Storyboard Scene Cards */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {video.scenes.map((scene, idx) => {
              const isActive = currentSceneIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-slate-800/90 border-emerald-500/70 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">
                        {scene.sceneNumber}
                      </span>
                      <h4 className="font-semibold text-white text-sm">{scene.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {scene.duration}s
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/40">
                        {scene.transition}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Visual Direction: </span>
                      <span className="text-slate-200">{scene.visualDescription}</span>
                    </div>

                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                      <div>
                        <span className="text-emerald-400 font-semibold">On-Screen Text: </span>
                        <span className="text-white font-medium">"{scene.onScreenText}"</span>
                      </div>
                      <div>
                        <span className="text-indigo-400 font-semibold">Voiceover Line: </span>
                        <span className="text-slate-300 italic">"{scene.voiceover}"</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
