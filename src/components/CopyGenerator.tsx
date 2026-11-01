import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Instagram,
  Linkedin,
  Twitter,
  Edit3,
  Save,
  MessageSquare,
  Hash,
  ArrowRight,
} from 'lucide-react';
import { CampaignBrief, CampaignCopy } from '../types';

interface CopyGeneratorProps {
  brief: CampaignBrief;
  copy: CampaignCopy;
  onUpdateCopy: (updated: CampaignCopy) => void;
  onRegenerate: (instructions?: string) => void;
  isRegenerating: boolean;
}

export const CopyGenerator: React.FC<CopyGeneratorProps> = ({
  brief,
  copy,
  onUpdateCopy,
  onRegenerate,
  isRegenerating,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCopy, setEditedCopy] = useState<CampaignCopy>(copy);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [activeSocialTab, setActiveSocialTab] = useState<'instagram' | 'linkedin' | 'twitter'>('instagram');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveEdit = () => {
    onUpdateCopy(editedCopy);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>AI Copywriting Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            Marketing Copy & Social Posts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tailored for {brief.brandName} • Tone: <span className="text-indigo-400 capitalize">{brief.advertisingTone}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isEditing) handleSaveEdit();
              else {
                setEditedCopy(copy);
                setIsEditing(true);
              }
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition cursor-pointer ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" /> Save Edits
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" /> Edit Content
              </>
            )}
          </button>

          <button
            onClick={() => onRegenerate(refinementPrompt)}
            disabled={isRegenerating}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Refinement Prompt Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 hidden sm:block" />
        <input
          type="text"
          value={refinementPrompt}
          onChange={(e) => setRefinementPrompt(e.target.value)}
          placeholder="Refinement instructions (e.g., 'Make it punchier', 'Emphasize the launch discount', 'Shorten for Gen-Z audience')..."
          className="w-full bg-slate-800/60 border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={() => onRegenerate(refinementPrompt)}
          disabled={isRegenerating}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shrink-0 transition disabled:opacity-50 cursor-pointer"
        >
          Refine
        </button>
      </div>

      {/* 1. Campaign Headlines */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            High-Impact Campaign Headlines
          </h3>
          <span className="text-xs text-slate-400">{copy.headlines.length} Variations</span>
        </div>

        <div className="space-y-3">
          {copy.headlines.map((headline, idx) => (
            <div
              key={idx}
              className="group p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition flex items-start justify-between gap-4"
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editedCopy.headlines[idx] || ''}
                  onChange={(e) => {
                    const newHeadlines = [...editedCopy.headlines];
                    newHeadlines[idx] = e.target.value;
                    setEditedCopy({ ...editedCopy, headlines: newHeadlines });
                  }}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded mt-0.5">
                    Option {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-white">{headline}</p>
                </div>
              )}

              <button
                onClick={() => handleCopy(headline, `headline-${idx}`)}
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-700 shrink-0 cursor-pointer"
                title="Copy Headline"
              >
                {copiedKey === `headline-${idx}` ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Product Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="font-semibold text-white text-sm">Short Product Teaser</h4>
              <button
                onClick={() => handleCopy(copy.descriptions.short, 'desc-short')}
                className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
                title="Copy Short Description"
              >
                {copiedKey === 'desc-short' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {isEditing ? (
              <textarea
                rows={3}
                value={editedCopy.descriptions.short}
                onChange={(e) =>
                  setEditedCopy({
                    ...editedCopy,
                    descriptions: { ...editedCopy.descriptions, short: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-xs text-white"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">
                {copy.descriptions.short}
              </p>
            )}
          </div>
          <span className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            Ideal for product cards, quick meta descriptions, and Google ad snippets.
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="font-semibold text-white text-sm">Long Narrative Copy</h4>
              <button
                onClick={() => handleCopy(copy.descriptions.long, 'desc-long')}
                className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
                title="Copy Long Description"
              >
                {copiedKey === 'desc-long' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {isEditing ? (
              <textarea
                rows={4}
                value={editedCopy.descriptions.long}
                onChange={(e) =>
                  setEditedCopy({
                    ...editedCopy,
                    descriptions: { ...editedCopy.descriptions, long: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-xs text-white"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">
                {copy.descriptions.long}
              </p>
            )}
          </div>
          <span className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            For landing page hero sections, press releases, and editorial features.
          </span>
        </div>
      </div>

      {/* 3. Social Media Posts & Captions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">Platform-Optimized Posts</h3>
          </div>

          {/* Social Platform Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveSocialTab('instagram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeSocialTab === 'instagram'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </button>
            <button
              onClick={() => setActiveSocialTab('linkedin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeSocialTab === 'linkedin'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </button>
            <button
              onClick={() => setActiveSocialTab('twitter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeSocialTab === 'twitter'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Twitter className="w-3.5 h-3.5" /> Twitter / X
            </button>
          </div>
        </div>

        {/* Social Post Content Box */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 relative">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span className="capitalize font-medium text-slate-300">
              {activeSocialTab} Feed Preview
            </span>
            <button
              onClick={() =>
                handleCopy(copy.promotionalCaptions[activeSocialTab], `social-${activeSocialTab}`)
              }
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              {copiedKey === `social-${activeSocialTab}` ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Post</span>
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            <textarea
              rows={5}
              value={editedCopy.promotionalCaptions[activeSocialTab]}
              onChange={(e) =>
                setEditedCopy({
                  ...editedCopy,
                  promotionalCaptions: {
                    ...editedCopy.promotionalCaptions,
                    [activeSocialTab]: e.target.value,
                  },
                })
              }
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-xs text-white"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {copy.promotionalCaptions[activeSocialTab]}
            </p>
          )}
        </div>
      </div>

      {/* 4. Slogans, Hashtags & CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slogans */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Advertising Slogans
            </h4>
          </div>
          <div className="space-y-2">
            {copy.slogans.map((slogan, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 text-xs text-slate-200 group"
              >
                <span className="font-medium italic">"{slogan}"</span>
                <button
                  onClick={() => handleCopy(slogan, `slogan-${idx}`)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition p-1 cursor-pointer"
                >
                  {copiedKey === `slogan-${idx}` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-indigo-400" /> Recommended Hashtags
            </h4>
            <button
              onClick={() => handleCopy(copy.hashtags.join(' '), 'hashtags')}
              className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              {copiedKey === 'hashtags' ? 'Copied' : 'Copy All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {copy.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Call to Actions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Call-to-Action Variations
            </h4>
          </div>
          <div className="space-y-2">
            {copy.callToActions.map((cta, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-pink-950/20 border border-pink-900/30 text-xs text-pink-200 group"
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-pink-400 shrink-0" /> {cta}
                </span>
                <button
                  onClick={() => handleCopy(cta, `cta-${idx}`)}
                  className="opacity-0 group-hover:opacity-100 text-pink-300 hover:text-white transition p-1 cursor-pointer"
                >
                  {copiedKey === `cta-${idx}` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
