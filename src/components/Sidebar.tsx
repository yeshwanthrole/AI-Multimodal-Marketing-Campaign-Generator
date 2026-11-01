import React from 'react';
import {
  Sparkles,
  Layers,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  CheckCircle2,
  ShieldCheck,
  Package,
  Wand2,
} from 'lucide-react';
import { ActiveTab, FullCampaign } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  campaign: FullCampaign | null;
  isGenerating: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  campaign,
  isGenerating,
}) => {
  const navItems = [
    {
      id: 'setup' as ActiveTab,
      label: 'Campaign Setup',
      icon: Wand2,
      subtitle: 'Brief & Brand Config',
    },
    {
      id: 'overview' as ActiveTab,
      label: 'Campaign Overview',
      icon: Layers,
      subtitle: 'Strategy & Core Pillars',
      badge: campaign ? 'Ready' : undefined,
    },
    {
      id: 'copy' as ActiveTab,
      label: 'Marketing Copy',
      icon: FileText,
      subtitle: 'Headlines, Posts & Slogans',
      count: campaign ? campaign.copy.headlines.length : 0,
    },
    {
      id: 'poster' as ActiveTab,
      label: 'Poster Generator',
      icon: ImageIcon,
      subtitle: 'Multi-style Canvas Art',
      badge: campaign ? 'Generated' : undefined,
    },
    {
      id: 'jingle' as ActiveTab,
      label: 'Jingle & Audio',
      icon: Music,
      subtitle: 'Web Audio Synth & Lyrics',
      badge: campaign ? '15s Audio' : undefined,
    },
    {
      id: 'video' as ActiveTab,
      label: 'Short Video',
      icon: Video,
      subtitle: 'Storyboard & Reel Player',
      count: campaign ? campaign.video.scenes.length : 0,
    },
    {
      id: 'consistency' as ActiveTab,
      label: 'Consistency Checker',
      icon: CheckCircle2,
      subtitle: 'Cross-Format Matrix',
      score: campaign ? campaign.consistency.overallScore : null,
    },
    {
      id: 'ethics' as ActiveTab,
      label: 'Ethics & Compliance',
      icon: ShieldCheck,
      subtitle: 'Responsible AI Review',
      complianceScore: campaign ? campaign.ethics.complianceScore : null,
    },
    {
      id: 'mediapack' as ActiveTab,
      label: 'Final Media Pack',
      icon: Package,
      subtitle: 'Download Complete Suite',
      badge: campaign?.approvedByHuman ? 'Signed' : campaign ? 'Ready' : undefined,
    },
  ];

  return (
    <aside className="w-72 bg-slate-900/90 border-r border-slate-800/80 flex flex-col h-screen sticky top-0 backdrop-blur-xl z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight flex items-center gap-1.5 font-['Space_Grotesk']">
              ApexMultimodal
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI 3.8
              </span>
            </h1>
            <p className="text-xs text-slate-400">Marketing Campaign Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Campaign Workflow
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-600/20 font-medium'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm truncate font-medium">{item.label}</div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {/* Status Indicator / Badges */}
              {item.score !== null && item.score !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    item.score >= 90
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : item.score >= 75
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {item.score}%
                </span>
              )}

              {item.complianceScore !== null && item.complianceScore !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                  {item.complianceScore}%
                </span>
              )}

              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium shrink-0 ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Coordinated Assets</span>
          <span className="font-semibold text-slate-200">
            {campaign ? '4 / 4 Active' : '0 / 4'}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              campaign
                ? 'w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                : 'w-1/6 bg-indigo-500'
            }`}
          />
        </div>

        {isGenerating && (
          <div className="mt-3 flex items-center gap-2 text-xs text-indigo-400 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            Generating Multimodal Assets...
          </div>
        )}
      </div>
    </aside>
  );
};
