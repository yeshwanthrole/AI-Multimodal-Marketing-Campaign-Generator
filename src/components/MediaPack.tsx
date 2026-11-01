import React, { useState } from 'react';
import {
  Package,
  Download,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  CheckCircle2,
  ShieldCheck,
  FileDown,
  Printer,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { CampaignBrief, FullCampaign } from '../types';
import { generateCampaignMediaPackZip } from '../utils/exportZip';
import { audioEngine } from '../utils/audioEngine';

interface MediaPackProps {
  brief: CampaignBrief;
  campaign: FullCampaign;
  posterDataUrl?: string;
  onNavigateToEthics: () => void;
}

export const MediaPack: React.FC<MediaPackProps> = ({
  brief,
  campaign,
  posterDataUrl,
  onNavigateToEthics,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);

  const isSigned = !!campaign.approvedByHuman;

  // Master ZIP Download
  const handleDownloadFullZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateCampaignMediaPackZip(brief, campaign, posterDataUrl);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brief.brandName}_${brief.productName}_Full_Media_Pack.zip`.replace(/\s+/g, '_');
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating ZIP pack:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Individual Downloads
  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCopy = () => {
    const content = `CAMPAIGN HEADLINES:
${campaign.copy.headlines.join('\n')}

SHORT DESCRIPTION:
${campaign.copy.descriptions.short}

LONG DESCRIPTION:
${campaign.copy.descriptions.long}

INSTAGRAM POST:
${campaign.copy.promotionalCaptions.instagram}

LINKEDIN POST:
${campaign.copy.promotionalCaptions.linkedin}

TWITTER / X POST:
${campaign.copy.promotionalCaptions.twitter}

TAGLINES:
${campaign.copy.slogans.join('\n')}

HASHTAGS:
${campaign.copy.hashtags.join(' ')}

CALLS TO ACTION:
${campaign.copy.callToActions.join('\n')}
`;
    downloadTextFile(`${brief.brandName}_copy_assets.txt`, content);
  };

  const handleDownloadPoster = () => {
    if (posterDataUrl) {
      const a = document.createElement('a');
      a.href = posterDataUrl;
      a.download = `${brief.brandName}_poster.png`;
      a.click();
    }
  };

  const handleDownloadJingleWav = async () => {
    const blob = await audioEngine.exportWavBlob({
      style: campaign.jingle.musicalStyle,
      tempoBpm: campaign.jingle.tempoBpm,
      durationSeconds: 15,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brief.brandName}_jingle_15s.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadVideoScript = () => {
    const content = `# Promotional Video Storyboard
Title: ${campaign.video.title}
Format: ${campaign.video.format}
Duration: ${campaign.video.totalDurationSeconds}s

${campaign.video.scenes
  .map(
    (s) => `Scene ${s.sceneNumber}: ${s.title} (${s.duration}s)
Visual: ${s.visualDescription}
On-Screen Text: "${s.onScreenText}"
Voiceover: "${s.voiceover}"
Transition: ${s.transition}
`
  )
  .join('\n---\n')}`;
    downloadTextFile(`${brief.brandName}_video_storyboard.txt`, content);
  };

  const handleDownloadConsistency = () => {
    downloadTextFile(
      `${brief.brandName}_consistency_audit.json`,
      JSON.stringify(campaign.consistency, null, 2)
    );
  };

  const handleDownloadEthics = () => {
    downloadTextFile(
      `${brief.brandName}_ethics_report.json`,
      JSON.stringify(campaign.ethics, null, 2)
    );
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Deployment Deliverables</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            Final Campaign Media Pack
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete coordinated marketing assets, high-res media, consistency audits, and ethics certificates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintSummary}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadFullZip}
            disabled={isZipping}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Packaging ZIP Archive...' : 'Download Complete Campaign ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Human Sign-Off Status Banner */}
      {!isSigned ? (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Draft Mode:</strong> This campaign has not yet received human Marketing Director sign-off. You can download preview assets, but final commercial ad rollout requires authorization.
            </span>
          </div>
          <button
            onClick={onNavigateToEthics}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold shrink-0 transition cursor-pointer"
          >
            Sign-Off in Ethics
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/40 flex items-center justify-between gap-4 text-xs text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              <strong>Verified Commercial Asset:</strong> Formally approved by{' '}
              <strong>{campaign.approvedByHuman?.approverName}</strong> (
              {campaign.approvedByHuman?.approvalRole}) on {campaign.approvedByHuman?.timestamp}.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/50">
            {campaign.approvedByHuman?.signatureHash}
          </span>
        </div>
      )}

      {/* Individual Download Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Copy Assets */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">.TXT Format</span>
            </div>
            <h4 className="font-bold text-white text-sm">Marketing Copy Suite</h4>
            <p className="text-xs text-slate-400 mt-1">
              Includes 3 headlines, short/long product descriptions, Instagram/LinkedIn/Twitter posts, slogans, and hashtags.
            </p>
          </div>
          <button
            onClick={handleDownloadCopy}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Copy (.txt)
          </button>
        </div>

        {/* Poster Image */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">.PNG Format</span>
            </div>
            <h4 className="font-bold text-white text-sm">High-Resolution Poster</h4>
            <p className="text-xs text-slate-400 mt-1">
              Master advertising artwork rendered with brand colors, headline typography, and AI disclosure badge.
            </p>
          </div>
          <button
            onClick={handleDownloadPoster}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Poster (.png)
          </button>
        </div>

        {/* Audio Jingle */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                <Music className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">.WAV Format</span>
            </div>
            <h4 className="font-bold text-white text-sm">15-Second Audio Jingle</h4>
            <p className="text-xs text-slate-400 mt-1">
              High-fidelity 16-bit PCM WAV audio arrangement with melodic chords, bassline, and sonic branding.
            </p>
          </div>
          <button
            onClick={handleDownloadJingleWav}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Audio (.wav)
          </button>
        </div>

        {/* Video Storyboard */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">.MD / .TXT</span>
            </div>
            <h4 className="font-bold text-white text-sm">Promotional Video Reel</h4>
            <p className="text-xs text-slate-400 mt-1">
              Complete 4-scene video production storyboard with timing, subtitles, voiceover script, and transitions.
            </p>
          </div>
          <button
            onClick={handleDownloadVideoScript}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Storyboard (.txt)
          </button>
        </div>

        {/* Consistency Audit Report */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">.JSON Format</span>
            </div>
            <h4 className="font-bold text-white text-sm">Consistency Matrix Report</h4>
            <p className="text-xs text-slate-400 mt-1">
              8-dimension cross-format evaluation results with individual asset scores and synchronization findings.
            </p>
          </div>
          <button
            onClick={handleDownloadConsistency}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Matrix (.json)
          </button>
        </div>

        {/* Ethics Compliance Certificate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">.JSON Format</span>
            </div>
            <h4 className="font-bold text-white text-sm">Ethics & Compliance Certificate</h4>
            <p className="text-xs text-slate-400 mt-1">
              Formal audit findings across claims substantiation, copyright clearance, and digital verification seal.
            </p>
          </div>
          <button
            onClick={handleDownloadEthics}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Ethics (.json)
          </button>
        </div>
      </div>
    </div>
  );
};
