/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CampaignForm } from './components/CampaignForm';
import { CampaignOverview } from './components/CampaignOverview';
import { CopyGenerator } from './components/CopyGenerator';
import { PosterGenerator } from './components/PosterGenerator';
import { JingleGenerator } from './components/JingleGenerator';
import { VideoGenerator } from './components/VideoGenerator';
import { ConsistencyChecker } from './components/ConsistencyChecker';
import { EthicsReview } from './components/EthicsReview';
import { MediaPack } from './components/MediaPack';
import {
  ActiveTab,
  CampaignBrief,
  CampaignCopy,
  FullCampaign,
  JingleData,
  PosterConfig,
  VideoData,
} from './types';
import { DEFAULT_BRIEF } from './utils/presets';

export default function App() {
  const [brief, setBrief] = useState<CampaignBrief>(DEFAULT_BRIEF);
  const [campaign, setCampaign] = useState<FullCampaign | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingConsistency, setIsCheckingConsistency] = useState(false);
  const [isCheckingEthics, setIsCheckingEthics] = useState(false);
  const [posterDataUrl, setPosterDataUrl] = useState<string | undefined>(undefined);

  // Generate complete campaign
  const handleGenerateCampaign = useCallback(async (currentBrief?: CampaignBrief) => {
    const briefToUse = currentBrief || brief;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(briefToUse),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.campaign) {
        setCampaign(data.campaign);
        // If currently in setup, route to overview
        if (activeTab === 'setup') {
          setActiveTab('overview');
        }
      }
    } catch (err) {
      console.error('Failed to generate campaign:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [brief, activeTab]);

  // Initial load
  useEffect(() => {
    handleGenerateCampaign(DEFAULT_BRIEF);
  }, []);

  // Handle switching preset
  const handleSelectPreset = (presetBrief: CampaignBrief) => {
    setBrief(presetBrief);
    handleGenerateCampaign(presetBrief);
  };

  // Re-check Consistency after user edits
  const handleRecheckConsistency = async () => {
    if (!campaign) return;
    setIsCheckingConsistency(true);
    try {
      const res = await fetch('/api/check-consistency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          copy: campaign.copy,
          poster: campaign.poster,
          jingle: campaign.jingle,
          video: campaign.video,
        }),
      });
      const data = await res.json();
      if (data.consistency) {
        setCampaign((prev) => (prev ? { ...prev, consistency: data.consistency } : prev));
      }
    } catch (err) {
      console.error('Failed to check consistency:', err);
    } finally {
      setIsCheckingConsistency(false);
    }
  };

  // Re-check Ethics after user edits
  const handleRecheckEthics = async () => {
    if (!campaign) return;
    setIsCheckingEthics(true);
    try {
      const res = await fetch('/api/review-ethics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          copy: campaign.copy,
          poster: campaign.poster,
          video: campaign.video,
        }),
      });
      const data = await res.json();
      if (data.ethics) {
        setCampaign((prev) => (prev ? { ...prev, ethics: data.ethics } : prev));
      }
    } catch (err) {
      console.error('Failed to review ethics:', err);
    } finally {
      setIsCheckingEthics(false);
    }
  };

  // Single asset regeneration
  const handleRegenerateAsset = async (assetType: 'copy' | 'poster' | 'jingle' | 'video', instructions?: string) => {
    if (!campaign) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/regenerate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetType,
          brief,
          currentAsset: (campaign as any)[assetType],
          instructions,
        }),
      });
      const data = await res.json();
      if (data.asset) {
        setCampaign((prev) => (prev ? { ...prev, [assetType]: data.asset } : prev));
      }
    } catch (err) {
      console.error(`Failed to regenerate ${assetType}:`, err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        campaign={campaign}
        isGenerating={isGenerating}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          brief={brief}
          onSelectPreset={handleSelectPreset}
          onGenerateCampaign={() => handleGenerateCampaign()}
          isGenerating={isGenerating}
          campaign={campaign}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'setup' && (
            <CampaignForm
              brief={brief}
              setBrief={setBrief}
              onGenerate={() => handleGenerateCampaign()}
              isGenerating={isGenerating}
            />
          )}

          {campaign && (
            <>
              {activeTab === 'overview' && (
                <CampaignOverview
                  brief={brief}
                  campaign={campaign}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'copy' && (
                <CopyGenerator
                  brief={brief}
                  copy={campaign.copy}
                  onUpdateCopy={(updated: CampaignCopy) =>
                    setCampaign((prev) => (prev ? { ...prev, copy: updated } : prev))
                  }
                  onRegenerate={(instructions) => handleRegenerateAsset('copy', instructions)}
                  isRegenerating={isGenerating}
                />
              )}

              {activeTab === 'poster' && (
                <PosterGenerator
                  brief={brief}
                  poster={campaign.poster}
                  onUpdatePoster={(updated: PosterConfig) =>
                    setCampaign((prev) => (prev ? { ...prev, poster: updated } : prev))
                  }
                  onRegenerate={(instructions) => handleRegenerateAsset('poster', instructions)}
                  isRegenerating={isGenerating}
                  onExportDataUrl={(url) => setPosterDataUrl(url)}
                />
              )}

              {activeTab === 'jingle' && (
                <JingleGenerator
                  brief={brief}
                  jingle={campaign.jingle}
                  onUpdateJingle={(updated: JingleData) =>
                    setCampaign((prev) => (prev ? { ...prev, jingle: updated } : prev))
                  }
                  onRegenerate={(instructions) => handleRegenerateAsset('jingle', instructions)}
                  isRegenerating={isGenerating}
                />
              )}

              {activeTab === 'video' && (
                <VideoGenerator
                  brief={brief}
                  video={campaign.video}
                  onUpdateVideo={(updated: VideoData) =>
                    setCampaign((prev) => (prev ? { ...prev, video: updated } : prev))
                  }
                  onRegenerate={(instructions) => handleRegenerateAsset('video', instructions)}
                  isRegenerating={isGenerating}
                />
              )}

              {activeTab === 'consistency' && (
                <ConsistencyChecker
                  brief={brief}
                  campaign={campaign}
                  onUpdateCampaign={setCampaign}
                  onRecheckConsistency={handleRecheckConsistency}
                  isChecking={isCheckingConsistency}
                />
              )}

              {activeTab === 'ethics' && (
                <EthicsReview
                  brief={brief}
                  campaign={campaign}
                  onUpdateCampaign={setCampaign}
                  onRecheckEthics={handleRecheckEthics}
                  isChecking={isCheckingEthics}
                />
              )}

              {activeTab === 'mediapack' && (
                <MediaPack
                  brief={brief}
                  campaign={campaign}
                  posterDataUrl={posterDataUrl}
                  onNavigateToEthics={() => setActiveTab('ethics')}
                />
              )}
            </>
          )}

          {!campaign && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <span className="text-2xl font-bold">✨</span>
              </div>
              <h3 className="text-xl font-bold text-white">No Campaign Active</h3>
              <p className="text-sm text-slate-400 max-w-md">
                Configure your brief or load a quick preset, then generate your coordinated multimodal campaign.
              </p>
              <button
                onClick={() => handleGenerateCampaign()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
              >
                Generate First Campaign
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
