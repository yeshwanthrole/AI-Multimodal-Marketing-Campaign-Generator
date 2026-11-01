import React from 'react';
import {
  Wand2,
  Download,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { CampaignBrief, FullCampaign, ActiveTab } from '../types';
import { CAMPAIGN_PRESETS } from '../utils/presets';

interface HeaderProps {
  brief: CampaignBrief;
  onSelectPreset: (presetBrief: CampaignBrief) => void;
  onGenerateCampaign: () => void;
  isGenerating: boolean;
  campaign: FullCampaign | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  brief,
  onSelectPreset,
  onGenerateCampaign,
  isGenerating,
  campaign,
  setActiveTab,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Active Product & Preset Picker */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">
              {brief.brandName || 'ApexWave'}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-medium text-indigo-300">
              {brief.productName || 'UltraPulse'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Tone: <strong className="text-slate-300 capitalize">{brief.advertisingTone}</strong></span>
            <span>•</span>
            <span>Platform: <strong className="text-slate-300">{brief.marketingPlatform}</strong></span>
          </div>
        </div>

        {/* Quick Preset Selector */}
        <div className="hidden lg:flex items-center ml-2">
          <select
            onChange={(e) => {
              const selected = CAMPAIGN_PRESETS.find((p) => p.label === e.target.value);
              if (selected) onSelectPreset(selected.brief);
            }}
            value={CAMPAIGN_PRESETS.find((p) => p.brief.productName === brief.productName)?.label || ''}
            className="text-xs bg-slate-800/90 text-slate-300 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="" disabled>Load Campaign Preset...</option>
            {CAMPAIGN_PRESETS.map((p) => (
              <option key={p.label} value={p.label}>
                Preset: {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Scores & Global Actions */}
      <div className="flex items-center gap-3">
        {/* Consistency Score Badge */}
        {campaign && (
          <button
            onClick={() => setActiveTab('consistency')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 transition text-xs"
            title="View Cross-Format Consistency Matrix"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">Consistency:</span>
            <span className="font-bold text-emerald-400">
              {campaign.consistency.overallScore}/100
            </span>
          </button>
        )}

        {/* Ethics Score Badge */}
        {campaign && (
          <button
            onClick={() => setActiveTab('ethics')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 transition text-xs"
            title="View AI Ethics & Responsible Review"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300">Ethics:</span>
            <span className="font-bold text-purple-300">
              {campaign.ethics.complianceScore}%
            </span>
          </button>
        )}

        {/* Media Pack Quick Nav */}
        {campaign && (
          <button
            onClick={() => setActiveTab('mediapack')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export Media Pack</span>
          </button>
        )}

        {/* Primary Generate Campaign Button */}
        <button
          onClick={onGenerateCampaign}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Generating Campaign...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Generate Coordinated Campaign</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-200" />
            </>
          )}
        </button>
      </div>
    </header>
  );
};
