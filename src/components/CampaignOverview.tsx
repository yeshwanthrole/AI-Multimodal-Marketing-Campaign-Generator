import React from 'react';
import {
  Sparkles,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Target,
  Share2,
} from 'lucide-react';
import { CampaignBrief, FullCampaign, ActiveTab } from '../types';

interface CampaignOverviewProps {
  brief: CampaignBrief;
  campaign: FullCampaign;
  setActiveTab: (tab: ActiveTab) => void;
}

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({
  brief,
  campaign,
  setActiveTab,
}) => {
  const assetCards = [
    {
      id: 'copy' as ActiveTab,
      title: 'Marketing Copy & Posts',
      icon: FileText,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
      badge: `${campaign.copy.headlines.length} Headlines`,
      preview: `"${campaign.copy.headlines[0]}"`,
      action: 'Edit Copy Assets',
    },
    {
      id: 'poster' as ActiveTab,
      title: 'Advertising Poster Image',
      icon: ImageIcon,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
      badge: `${campaign.poster.recommendedTemplates?.length || 4} Templates`,
      preview: `"${campaign.poster.headline}"`,
      action: 'Customize Art & Layout',
    },
    {
      id: 'jingle' as ActiveTab,
      title: 'Advertising Jingle & Audio',
      icon: Music,
      color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
      badge: `${campaign.jingle.tempoBpm} BPM • ${campaign.jingle.keySignature}`,
      preview: `"${campaign.jingle.title}"`,
      action: 'Play & Export Audio',
    },
    {
      id: 'video' as ActiveTab,
      title: 'Short Promotional Video',
      icon: Video,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badge: `${campaign.video.scenes.length} Scenes • ${campaign.video.totalDurationSeconds}s`,
      preview: `"${campaign.video.title}"`,
      action: 'View Reel & Record',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Hero Narrative Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 border border-indigo-500/30 p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                Active Coordinated Campaign
              </span>
              <span className="text-xs text-slate-400">
                Platform: <strong className="text-slate-200">{brief.marketingPlatform}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              {campaign.overview.tagline}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {campaign.overview.summary}
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="flex md:flex-col gap-3 shrink-0">
            <div
              onClick={() => setActiveTab('consistency')}
              className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-emerald-400 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Consistency Score</div>
                <div className="text-lg font-bold text-emerald-300">
                  {campaign.consistency.overallScore} / 100
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('ethics')}
              className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-purple-400 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Ethics Compliance</div>
                <div className="text-lg font-bold text-purple-300">
                  {campaign.ethics.complianceScore}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {campaign.overview.corePillars.map((pillar, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs font-medium text-slate-200">{pillar}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Multimodal Asset Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Coordinated Asset Studio</span>
          </h3>
          <span className="text-xs text-slate-400">
            Click any asset module to inspect, customize, or regenerate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assetCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`bg-slate-900/80 border rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group flex flex-col justify-between ${card.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-800/90">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-white text-base group-hover:text-indigo-300 transition">
                        {card.title}
                      </h4>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                      {card.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic mb-4 line-clamp-2">
                    {card.preview}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-white">
                  <span>{card.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Target & Placement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Target className="w-5 h-5" />
            <h4 className="font-semibold text-white text-sm">Target Audience</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {brief.targetAudience}
          </p>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Optimized for maximum resonance with demographic priorities.
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Share2 className="w-5 h-5" />
            <h4 className="font-semibold text-white text-sm">Distribution Strategy</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Coordinated across {brief.marketingPlatform} using short-form video reels, high-contrast display posters, and punchy promotional copy.
          </p>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Consistent tone ({brief.advertisingTone}) and identical core CTA.
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
            <h4 className="font-semibold text-white text-sm">Campaign Objective</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {brief.campaignObjective}
          </p>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Reinforced with approved claims and clear launch incentive.
          </div>
        </div>
      </div>
    </div>
  );
};
