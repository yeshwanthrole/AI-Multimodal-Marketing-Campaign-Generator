import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Palette,
  Target,
  Globe,
  Sliders,
  CheckCircle,
  Plus,
  Trash2,
  BookmarkCheck,
  Tag,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { CampaignBrief, AdvertisingTone, MarketingPlatform } from '../types';
import { CAMPAIGN_PRESETS } from '../utils/presets';

interface CampaignFormProps {
  brief: CampaignBrief;
  setBrief: React.Dispatch<React.SetStateAction<CampaignBrief>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  brief,
  setBrief,
  onGenerate,
  isGenerating,
}) => {
  const [newFeature, setNewFeature] = useState('');
  const [newClaim, setNewClaim] = useState('');

  const toneOptions: { id: AdvertisingTone; label: string; desc: string }[] = [
    { id: 'professional', label: 'Professional', desc: 'Authoritative, clear, corporate & trusted' },
    { id: 'modern', label: 'Modern', desc: 'Minimalist, chic, progressive & sleek' },
    { id: 'creative', label: 'Creative', desc: 'Artistic, poetic, evocative & unexpected' },
    { id: 'energetic', label: 'Energetic', desc: 'Fast-paced, bold, motivational & high-impact' },
    { id: 'friendly', label: 'Friendly', desc: 'Approachable, warm, conversational & empathetic' },
  ];

  const platformOptions: MarketingPlatform[] = [
    'Multi-Channel',
    'Instagram',
    'YouTube',
    'Facebook',
    'TikTok',
    'LinkedIn',
  ];

  const colorPalettes = [
    { name: 'Indigo Pulse', p: '#6366f1', s: '#3b82f6', a: '#f43f5e' },
    { name: 'Cyber Violet', p: '#8b5cf6', s: '#06b6d4', a: '#f59e0b' },
    { name: 'Emerald Tech', p: '#10b981', s: '#059669', a: '#3b82f6' },
    { name: 'Sunset Royale', p: '#ec4899', s: '#8b5cf6', a: '#f97316' },
    { name: 'Dark Slate Gold', p: '#334155', s: '#1e293b', a: '#eab308' },
  ];

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setBrief((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setBrief((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== idx),
    }));
  };

  const handleAddClaim = () => {
    if (newClaim.trim()) {
      setBrief((prev) => ({
        ...prev,
        approvedClaims: [...prev.approvedClaims, newClaim.trim()],
      }));
      setNewClaim('');
    }
  };

  const handleRemoveClaim = (idx: number) => {
    setBrief((prev) => ({
      ...prev,
      approvedClaims: prev.approvedClaims.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900/90 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Multimodal Studio v3.8</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Campaign Setup & Strategy Brief
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Configure your brand identity, product specifications, verified claims, and target channels.
            Our generative AI engine simultaneously coordinates your <strong className="text-white">Marketing Copy</strong>,{' '}
            <strong className="text-white">Poster Art</strong>, <strong className="text-white">Audio Jingle</strong>, and{' '}
            <strong className="text-white">Video Storyboard</strong> while ensuring strict cross-format consistency.
          </p>
        </div>

        {/* Preset Quick Chips */}
        <div className="mt-6 pt-6 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" />
            Quick Presets:
          </span>
          {CAMPAIGN_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setBrief(p.brief)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-400/50 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {p.label.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Brief Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Brand & Product Details */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Target className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white text-base">Core Brand & Product Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Brand or Company Name *
                </label>
                <input
                  type="text"
                  value={brief.brandName}
                  onChange={(e) => setBrief({ ...brief, brandName: e.target.value })}
                  placeholder="e.g. AeroPulse Athletics"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Product or Service Name *
                </label>
                <input
                  type="text"
                  value={brief.productName}
                  onChange={(e) => setBrief({ ...brief, productName: e.target.value })}
                  placeholder="e.g. Nitro-Knit X1 Carbon Shoe"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Product Description & Narrative
              </label>
              <textarea
                rows={3}
                value={brief.productDescription}
                onChange={(e) => setBrief({ ...brief, productDescription: e.target.value })}
                placeholder="Describe what the product does, who it helps, and its breakthrough uniqueness..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed"
              />
            </div>

            {/* Key Features List */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Key Features & Value Propositions
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder="Add a key feature (e.g. 18% greater bounce)..."
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-white font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-2">
                {brief.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {feat}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-rose-400 transition p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Approved Claims & Legal Compliance Anchors */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <BookmarkCheck className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-white text-base">Approved Factual Claims</h3>
                  <p className="text-xs text-slate-400">Used by consistency checker to prevent fabricated or false statements</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newClaim}
                onChange={(e) => setNewClaim(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddClaim())}
                placeholder="e.g. Tested over 15,000 miles by elite runners..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddClaim}
                className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-sm text-purple-200 font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Claim
              </button>
            </div>

            <div className="space-y-2">
              {brief.approvedClaims.map((claim, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {claim}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveClaim(idx)}
                    className="text-slate-400 hover:text-rose-400 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Offer, Pricing & Call To Action */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Tag className="w-5 h-5 text-pink-400" />
              <h3 className="font-semibold text-white text-base">Call-to-Action & Promotional Offer</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Call-To-Action (CTA) *
              </label>
              <input
                type="text"
                value={brief.callToAction}
                onChange={(e) => setBrief({ ...brief, callToAction: e.target.value })}
                placeholder="e.g. Unlock Your Personal Best — Pre-Order Now"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Offer Details / Incentives
                </label>
                <input
                  type="text"
                  value={brief.offerDetails || ''}
                  onChange={(e) => setBrief({ ...brief, offerDetails: e.target.value })}
                  placeholder="e.g. 20% Off Launch Deal + Free Sensor"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Price Point
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={brief.pricePoint || ''}
                    onChange={(e) => setBrief({ ...brief, pricePoint: e.target.value })}
                    placeholder="e.g. $189 Launch Price"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Strategy, Brand Identity & Controls */}
        <div className="space-y-6">
          {/* Tone Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white text-base">Advertising Tone</h3>
            </div>

            <div className="space-y-2.5">
              {toneOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBrief({ ...brief, advertisingTone: opt.id })}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    brief.advertisingTone === opt.id
                      ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/30 border-indigo-500/70 shadow-sm'
                      : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white capitalize">{opt.label}</span>
                    {brief.advertisingTone === opt.id && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Colors */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Palette className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white text-base">Brand Colors</h3>
            </div>

            {/* Quick Palettes */}
            <div>
              <div className="text-xs text-slate-400 mb-2 font-medium">Palette Presets:</div>
              <div className="grid grid-cols-5 gap-2">
                {colorPalettes.map((cp) => (
                  <button
                    key={cp.name}
                    type="button"
                    onClick={() =>
                      setBrief({
                        ...brief,
                        primaryColor: cp.p,
                        secondaryColor: cp.s,
                        accentColor: cp.a,
                      })
                    }
                    className="p-1 rounded-lg border border-slate-700 hover:border-slate-500 transition group flex flex-col items-center gap-1 cursor-pointer"
                    title={cp.name}
                  >
                    <div className="flex w-full h-4 rounded overflow-hidden">
                      <div className="w-1/3 h-full" style={{ backgroundColor: cp.p }} />
                      <div className="w-1/3 h-full" style={{ backgroundColor: cp.s }} />
                      <div className="w-1/3 h-full" style={{ backgroundColor: cp.a }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Hex Inputs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Primary:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brief.primaryColor}
                    onChange={(e) => setBrief({ ...brief, primaryColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={brief.primaryColor}
                    onChange={(e) => setBrief({ ...brief, primaryColor: e.target.value })}
                    className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Secondary:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brief.secondaryColor}
                    onChange={(e) => setBrief({ ...brief, secondaryColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={brief.secondaryColor}
                    onChange={(e) => setBrief({ ...brief, secondaryColor: e.target.value })}
                    className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Accent:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brief.accentColor}
                    onChange={(e) => setBrief({ ...brief, accentColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={brief.accentColor}
                    onChange={(e) => setBrief({ ...brief, accentColor: e.target.value })}
                    className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Platform & Audience */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white text-base">Audience & Placement</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Platform
              </label>
              <select
                value={brief.marketingPlatform}
                onChange={(e) => setBrief({ ...brief, marketingPlatform: e.target.value as MarketingPlatform })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {platformOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Audience Demographics
              </label>
              <input
                type="text"
                value={brief.targetAudience}
                onChange={(e) => setBrief({ ...brief, targetAudience: e.target.value })}
                placeholder="e.g. Marathon runners and fitness enthusiasts aged 22-42"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Language
              </label>
              <input
                type="text"
                value={brief.preferredLanguage}
                onChange={(e) => setBrief({ ...brief, preferredLanguage: e.target.value })}
                placeholder="e.g. English"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bottom Launch Button */}
          <button
            onClick={onGenerate}
            disabled={isGenerating || !brief.brandName || !brief.productName}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <Wand2 className="w-5 h-5" />
            <span>Generate Multimodal Campaign</span>
          </button>
        </div>
      </div>
    </div>
  );
};
