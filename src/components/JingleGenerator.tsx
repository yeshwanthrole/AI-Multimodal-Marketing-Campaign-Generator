import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Square,
  Download,
  Volume2,
  RefreshCw,
  Sparkles,
  Mic,
  Sliders,
  Check,
  Radio,
  FileMusic,
} from 'lucide-react';
import { CampaignBrief, JingleData } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface JingleGeneratorProps {
  brief: CampaignBrief;
  jingle: JingleData;
  onUpdateJingle: (updated: JingleData) => void;
  onRegenerate: (instructions?: string) => void;
  isRegenerating: boolean;
}

export const JingleGenerator: React.FC<JingleGeneratorProps> = ({
  brief,
  jingle,
  onUpdateJingle,
  onRegenerate,
  isRegenerating,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(jingle.musicalStyle || 'Energetic Synth Pop');
  const [tempo, setTempo] = useState(jingle.tempoBpm || 128);

  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualizerAnimRef = useRef<number | null>(null);

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
      if (visualizerAnimRef.current) cancelAnimationFrame(visualizerAnimRef.current);
    };
  }, []);

  // Waveform visualization loop
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawVisualizer = () => {
      const analyser = audioEngine.getAnalyser();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, width, height);

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Draw frequency bars in gradient
        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.85;

          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, brief.primaryColor || '#6366f1');
          grad.addColorStop(1, brief.accentColor || '#ec4899');

          ctx.fillStyle = grad;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          x += barWidth + 1;
        }
      } else {
        // Static rhythmic aesthetic wave when paused
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const sliceWidth = width / 60;
        let x = 0;
        for (let i = 0; i < 60; i++) {
          const y = height / 2 + Math.sin(i * 0.3) * 12;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      }

      visualizerAnimRef.current = requestAnimationFrame(drawVisualizer);
    };

    visualizerAnimRef.current = requestAnimationFrame(drawVisualizer);
    return () => {
      if (visualizerAnimRef.current) cancelAnimationFrame(visualizerAnimRef.current);
    };
  }, [isPlaying, brief]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    } else {
      setIsPlaying(true);
      await audioEngine.playJingle({
        style: selectedStyle,
        tempoBpm: tempo,
        brandName: brief.brandName,
        callToAction: brief.callToAction,
        lyrics: jingle.lyrics,
        onProgress: (p, cur) => {
          setProgress(p);
          setCurrentTime(cur);

          // Update active lyric line based on time
          if (cur < 3) setActiveLyricIndex(0);
          else if (cur < 7) setActiveLyricIndex(1);
          else if (cur < 11) setActiveLyricIndex(2);
          else if (cur < 14) setActiveLyricIndex(3);
          else setActiveLyricIndex(4);
        },
        onEnd: () => {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        },
      });
    }
  };

  const handleDownloadWav = async () => {
    try {
      setIsExporting(true);
      const blob = await audioEngine.exportWavBlob({
        style: selectedStyle,
        tempoBpm: tempo,
        durationSeconds: 15,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brief.brandName}_${brief.productName}_jingle_15s.wav`.replace(/\s+/g, '_');
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('WAV export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold mb-2">
            <Music className="w-3.5 h-3.5" />
            <span>AI Audio Jingle & Sonic Branding</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            Advertising Jingle & Music Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Web Audio Synthesizer • {tempo} BPM • Key of {jingle.keySignature}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadWav}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white flex items-center gap-1.5 shadow-md shadow-pink-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Synthesizing...' : 'Download Jingle (WAV)'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Player & Waveform Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              15-Second Commercial Audio Spot
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{jingle.title}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Style: <span className="text-slate-200">{selectedStyle}</span> • Voiceover:{' '}
              <span className="text-slate-300 italic">{jingle.voiceDirection}</span>
            </p>
          </div>

          {/* Master Play Button */}
          <button
            onClick={handleTogglePlay}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg shrink-0 cursor-pointer ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                : 'bg-gradient-to-tr from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white shadow-pink-500/30 scale-105'
            }`}
          >
            {isPlaying ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
          </button>
        </div>

        {/* Real-time Frequency Canvas */}
        <div className="rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
          <canvas
            ref={visualizerCanvasRef}
            width={760}
            height={90}
            className="w-full h-24 object-cover"
          />
        </div>

        {/* Timeline & Scrubber */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{currentTime.toFixed(1)}s</span>
            <span className="text-pink-300 font-semibold">15.0s Master Cut</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-100 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Synchronized Lyrics Display */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-pink-400" />
              Synchronized Commercial Lyrics & Cue Sheet
            </span>
            <span>{isPlaying ? '● Live Track Playback' : 'Ready'}</span>
          </div>

          <div className="space-y-2">
            {jingle.lyrics.map((lyric, idx) => {
              const isCurrent = isPlaying && activeLyricIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between text-xs sm:text-sm ${
                    isCurrent
                      ? 'bg-pink-950/40 border-pink-500 text-white font-semibold shadow-md shadow-pink-500/10 translate-x-1'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400 w-24 shrink-0">
                      {lyric.time}
                    </span>
                    <span>{lyric.line}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Musical Style Selector & Custom Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">Musical Style Preset</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'Energetic Upbeat Synth Pop', label: 'Energetic', bpm: 128 },
              { id: 'Acoustic Indie Pop with Chimes', label: 'Cheerful', bpm: 116 },
              { id: 'Modern Cinematic Corporate Ambient', label: 'Professional', bpm: 108 },
              { id: 'Modern Lo-Fi Electronic Beat', label: 'Modern', bpm: 112 },
            ].map((styleOpt) => (
              <button
                key={styleOpt.id}
                onClick={() => {
                  setSelectedStyle(styleOpt.id);
                  setTempo(styleOpt.bpm);
                }}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  selectedStyle === styleOpt.id
                    ? 'bg-pink-950/40 border-pink-500 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs">{styleOpt.label}</div>
                <div className="text-[10px] text-slate-400">{styleOpt.bpm} BPM</div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Tempo: <strong className="text-white">{tempo} BPM</strong>
            </label>
            <input
              type="range"
              min="90"
              max="150"
              value={tempo}
              onChange={(e) => setTempo(parseInt(e.target.value, 10))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>
        </div>

        {/* AI Audio Generation Prompt */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white text-base">Music Generation Prompt</h3>
            </div>
            <button
              onClick={() => onRegenerate(refinementPrompt)}
              disabled={isRegenerating}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          <textarea
            rows={4}
            value={jingle.prompt}
            onChange={(e) =>
              onUpdateJingle({
                ...jingle,
                prompt: e.target.value,
              })
            }
            className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-mono"
          />
          <p className="text-[11px] text-slate-400">
            Exportable to external AI audio tools (e.g. Lyria, Suno, Udio) or for licensed sonic branding studios.
          </p>
        </div>
      </div>
    </div>
  );
};
