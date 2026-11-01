import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Palette,
  Maximize2,
  Upload,
  Layers,
  Eye,
} from 'lucide-react';
import { CampaignBrief, PosterConfig } from '../types';

interface PosterGeneratorProps {
  brief: CampaignBrief;
  poster: PosterConfig;
  onUpdatePoster: (updated: PosterConfig) => void;
  onRegenerate: (instructions?: string) => void;
  isRegenerating: boolean;
  onExportDataUrl?: (dataUrl: string) => void;
}

type PosterStyle = 'modern_minimalist' | 'bold_editorial' | 'cyber_neon' | 'lifestyle_vibrant';
type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9';

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({
  brief,
  poster,
  onUpdatePoster,
  onRegenerate,
  isRegenerating,
  onExportDataUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [style, setStyle] = useState<PosterStyle>(
    (poster.layoutConfig.style as PosterStyle) || 'modern_minimalist'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    (poster.layoutConfig.aspectRatio as AspectRatio) || '4:5'
  );
  const [headline, setHeadline] = useState(poster.headline);
  const [subheadline, setSubheadline] = useState(poster.subheadline);
  const [badgeText, setBadgeText] = useState(poster.badgeText || 'OFFICIAL LAUNCH 2026');
  const [ctaText, setCtaText] = useState(poster.callToAction);
  const [showAiBadge, setShowAiBadge] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [refinementPrompt, setRefinementPrompt] = useState('');

  // Dimensions based on aspect ratio
  const getCanvasDimensions = useCallback((ratio: AspectRatio) => {
    switch (ratio) {
      case '1:1':
        return { width: 1080, height: 1080, displayClass: 'aspect-square max-w-[420px]' };
      case '4:5':
        return { width: 1080, height: 1350, displayClass: 'aspect-[4/5] max-w-[380px]' };
      case '9:16':
        return { width: 1080, height: 1920, displayClass: 'aspect-[9/16] max-w-[320px]' };
      case '16:9':
        return { width: 1920, height: 1080, displayClass: 'aspect-[16/9] max-w-[540px]' };
    }
  }, []);

  // Main Canvas Render Logic
  const renderPoster = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions(aspectRatio);
    canvas.width = width;
    canvas.height = height;

    const pColor = brief.primaryColor || '#6366f1';
    const sColor = brief.secondaryColor || '#3b82f6';
    const aColor = brief.accentColor || '#f43f5e';

    // 1. Background Fill & Gradients based on Style
    if (style === 'cyber_neon') {
      // Dark cybernetic grid with neon spotlights
      ctx.fillStyle = '#050714';
      ctx.fillRect(0, 0, width, height);

      // Radial glowing neon blobs
      const grad1 = ctx.createRadialGradient(width * 0.25, height * 0.3, 20, width * 0.25, height * 0.3, width * 0.6);
      grad1.addColorStop(0, pColor + '99');
      grad1.addColorStop(1, '#00000000');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 30, width * 0.8, height * 0.7, width * 0.7);
      grad2.addColorStop(0, aColor + '88');
      grad2.addColorStop(1, '#00000000');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid Lines
      ctx.strokeStyle = '#ffffff10';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (style === 'bold_editorial') {
      // Split high-contrast diagonal
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Angled polygon in primary color
      ctx.fillStyle = pColor + '33';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.2);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height * 0.85);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Bold accent border
      ctx.strokeStyle = aColor;
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, width - 60, height - 60);
    } else if (style === 'lifestyle_vibrant') {
      // Warm modern organic gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(0.5, pColor + '44');
      grad.addColorStop(1, sColor + '55');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Glowing circles
      ctx.fillStyle = aColor + '30';
      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.35, width * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Modern Minimalist (Default)
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.45, width * 0.8);
      grad.addColorStop(0, pColor + '50');
      grad.addColorStop(0.6, sColor + '20');
      grad.addColorStop(1, '#090d16');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Soft vignette border
      ctx.strokeStyle = '#ffffff15';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);
    }

    // 2. Draw Hero Product Graphic (Uploaded image or synthesized 3D orb/icon)
    const centerX = width * 0.5;
    const centerY = height * 0.48;

    if (uploadedImage) {
      // Draw user uploaded image scaled nicely
      const imgAspect = uploadedImage.width / uploadedImage.height;
      let targetW = width * 0.65;
      let targetH = targetW / imgAspect;
      if (targetH > height * 0.4) {
        targetH = height * 0.4;
        targetW = targetH * imgAspect;
      }
      ctx.drawImage(uploadedImage, centerX - targetW / 2, centerY - targetH / 2, targetW, targetH);
    } else {
      // Procedural 3D Holographic Hero Sphere / Product Silhouette
      // Glow behind
      const sphereGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width * 0.3);
      sphereGlow.addColorStop(0, aColor + 'cc');
      sphereGlow.addColorStop(0.5, pColor + '66');
      sphereGlow.addColorStop(1, '#00000000');
      ctx.fillStyle = sphereGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Stylized glass orb representing the breakthrough product
      const orbGrad = ctx.createLinearGradient(centerX - 150, centerY - 150, centerX + 150, centerY + 150);
      orbGrad.addColorStop(0, '#ffffffaa');
      orbGrad.addColorStop(0.3, pColor);
      orbGrad.addColorStop(0.8, sColor);
      orbGrad.addColorStop(1, '#0f172a');

      ctx.save();
      ctx.shadowColor = aColor;
      ctx.shadowBlur = 40;
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dynamic rings around product
      ctx.strokeStyle = '#ffffff60';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width * 0.32, width * 0.12, -Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Product Name on Core
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(width * 0.038)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(brief.productName.toUpperCase(), centerX, centerY);
    }

    // 3. Top Brand Header & Badge
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Badge text pill
    if (badgeText) {
      const pillY = height * 0.08;
      ctx.font = `bold ${Math.round(width * 0.024)}px 'Space Grotesk', sans-serif`;
      const badgeMetrics = ctx.measureText(badgeText);
      const pillW = badgeMetrics.width + 48;
      const pillH = Math.round(width * 0.05);

      ctx.fillStyle = aColor;
      ctx.beginPath();
      ctx.roundRect(centerX - pillW / 2, pillY, pillW, pillH, pillH / 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, centerX, pillY + pillH / 2);
    }

    // Brand Name
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 ${Math.round(width * 0.032)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText(brief.brandName.toUpperCase(), centerX, height * 0.15);

    // 4. Headline Text
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(width * 0.058)}px 'Space Grotesk', sans-serif`;

    // Wrap headline into 2 lines if needed
    const words = (headline || brief.productName).split(' ');
    let line1 = '';
    let line2 = '';
    words.forEach((w, i) => {
      if (i < Math.ceil(words.length / 2)) line1 += w + ' ';
      else line2 += w + ' ';
    });

    const headlineY = height * 0.72;
    ctx.fillText(line1.trim(), centerX, headlineY);
    if (line2.trim()) {
      ctx.fillText(line2.trim(), centerX, headlineY + width * 0.07);
    }

    // 5. Subheadline
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `400 ${Math.round(width * 0.028)}px 'Plus Jakarta Sans', sans-serif`;
    const subWords = (subheadline || brief.productDescription || '').slice(0, 95);
    ctx.fillText(subWords + (subheadline?.length > 95 ? '...' : ''), centerX, height * 0.85);

    // 6. Call To Action Button
    const ctaY = height * 0.90;
    const ctaFont = `bold ${Math.round(width * 0.032)}px 'Space Grotesk', sans-serif`;
    ctx.font = ctaFont;
    const ctaMetrics = ctx.measureText(ctaText || brief.callToAction);
    const btnW = ctaMetrics.width + 64;
    const btnH = Math.round(width * 0.065);

    // Button Glow
    ctx.save();
    ctx.shadowColor = pColor;
    ctx.shadowBlur = 25;
    ctx.fillStyle = pColor;
    ctx.beginPath();
    ctx.roundRect(centerX - btnW / 2, ctaY, btnW, btnH, 12);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(ctaText || brief.callToAction, centerX, ctaY + btnH / 2);

    // 7. Responsible AI Disclosure Watermark
    if (showAiBadge) {
      ctx.font = `500 ${Math.round(width * 0.018)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = '#94a3b899';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('⚡ Generative AI Multimodal Marketing Asset', 45, height - 25);

      ctx.textAlign = 'right';
      ctx.fillText(`${brief.brandName} © 2026`, width - 45, height - 25);
    }

    // Export current dataURL to parent if callback available
    if (onExportDataUrl) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        onExportDataUrl(dataUrl);
      } catch {}
    }
  }, [
    aspectRatio,
    style,
    headline,
    subheadline,
    badgeText,
    ctaText,
    showAiBadge,
    uploadedImage,
    brief,
    getCanvasDimensions,
    onExportDataUrl,
  ]);

  useEffect(() => {
    renderPoster();
  }, [renderPoster]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${brief.brandName}_${brief.productName}_poster.png`.replace(/\s+/g, '_');
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      handleDownload();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setUploadedImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const { displayClass } = getCanvasDimensions(aspectRatio);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>AI Poster & Advertisement Designer</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            Poster & Social Ad Creator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time high-resolution canvas renderer with brand color integration and AI disclosure watermarking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyImage}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Image</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download High-Res PNG</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Live Canvas Preview Viewport (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              Live Artwork Preview ({aspectRatio})
            </span>
            <span className="text-[11px] text-slate-400">1080p Master Render</span>
          </div>

          {/* Interactive Canvas Render */}
          <div className="w-full flex justify-center py-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              className={`w-full rounded-xl shadow-2xl border border-slate-700/80 object-contain transition-all ${displayClass}`}
            />
          </div>

          {/* Canvas Quick Actions */}
          <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <label className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>{uploadedImage ? 'Replace Product Photo' : 'Upload Product Photo'}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {uploadedImage && (
              <button
                onClick={() => setUploadedImage(null)}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Clear Photo
              </button>
            )}

            <button
              onClick={renderPoster}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Refresh View
            </button>
          </div>
        </div>

        {/* Right Col: Design Controls & Prompts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Style & Aspect Ratio Selectors */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Layers className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white text-base">Poster Aesthetic & Aspect Ratio</h3>
            </div>

            {/* Template Styles */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Aesthetic Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'modern_minimalist', label: 'Minimalist', desc: 'Clean Luxury' },
                  { id: 'bold_editorial', label: 'Editorial', desc: 'High Impact' },
                  { id: 'cyber_neon', label: 'Cyber Neon', desc: 'Futuristic Grid' },
                  { id: 'lifestyle_vibrant', label: 'Vibrant', desc: 'Modern Warm' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id as PosterStyle)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      style === s.id
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-semibold text-xs">{s.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Placement & Format
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '1:1', label: '1:1 Square', sub: 'Instagram Feed' },
                  { id: '4:5', label: '4:5 Portrait', sub: 'Mobile Ads' },
                  { id: '9:16', label: '9:16 Story', sub: 'Reels / TikTok' },
                  { id: '16:9', label: '16:9 Banner', sub: 'YouTube / Web' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id as AspectRatio)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      aspectRatio === r.id
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs">{r.label}</div>
                    <div className="text-[10px] text-slate-400">{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Typography & Text Controls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white text-base">Poster Typography & Copy Overlays</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Campaign Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Launch Badge Text
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subheadline / Feature Claim
                </label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Call-To-Action Button Text
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* AI Watermark Toggle */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">
                Include Responsible AI Disclosure Watermark
              </span>
              <input
                type="checkbox"
                checked={showAiBadge}
                onChange={(e) => setShowAiBadge(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </div>
          </div>

          {/* AI Visual Prompt Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h3 className="font-semibold text-white text-base">Generative 3D Visual Prompt</h3>
              </div>
              <button
                onClick={() => onRegenerate(refinementPrompt)}
                disabled={isRegenerating}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate Prompt</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={poster.visualPrompt}
              onChange={(e) =>
                onUpdatePoster({
                  ...poster,
                  visualPrompt: e.target.value,
                })
              }
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-mono"
            />
            <p className="text-[11px] text-slate-400">
              This prompt is formatted for high-definition commercial renders, incorporating brand colors ({brief.primaryColor}, {brief.accentColor}) and product styling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
