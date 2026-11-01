import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  UserCheck,
  Eye,
  Sparkles,
  Lock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { CampaignBrief, EthicsReport, EthicsStatus, FullCampaign } from '../types';

interface EthicsReviewProps {
  brief: CampaignBrief;
  campaign: FullCampaign;
  onUpdateCampaign: (updated: FullCampaign) => void;
  onRecheckEthics: () => void;
  isChecking: boolean;
}

export const EthicsReview: React.FC<EthicsReviewProps> = ({
  brief,
  campaign,
  onUpdateCampaign,
  onRecheckEthics,
  isChecking,
}) => {
  const { ethics } = campaign;
  const [approverName, setApproverName] = useState(
    campaign.approvedByHuman?.approverName || 'Alex Vance'
  );
  const [approverRole, setApproverRole] = useState(
    campaign.approvedByHuman?.approvalRole || 'Director of Brand & Compliance'
  );
  const [confirmedTerms, setConfirmedTerms] = useState(!!campaign.approvedByHuman);

  // Status Badge Helper
  const getStatusBadge = (status: EthicsStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Compliant
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Action Needed
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" /> Flagged Risk
          </span>
        );
    }
  };

  // Sign-Off Handler
  const handleHumanSignoff = () => {
    if (!approverName || !approverRole || !confirmedTerms) return;

    const signatureHash = `APX-ETHICS-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const updated = {
      ...campaign,
      approvedByHuman: {
        approverName,
        approvalRole: approverRole,
        timestamp: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        signatureHash,
      },
    };

    onUpdateCampaign(updated);
  };

  const handleRevokeSignoff = () => {
    const updated = { ...campaign };
    delete updated.approvedByHuman;
    onUpdateCampaign(updated);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Responsible AI Marketing Protocol</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            AI Ethics & Responsible Marketing Review
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Regulatory compliance audit covering claims substantiation, copyright, AI disclosure, and mandatory human sign-off
          </p>
        </div>

        <button
          onClick={onRecheckEthics}
          disabled={isChecking}
          className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Re-Auditing...' : 'Re-Run Ethics Audit'}</span>
        </button>
      </div>

      {/* Compliance Overview Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Audit Verdict
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {ethics.status === 'APPROVED'
              ? 'Fully Approved for Commercial Deployment'
              : ethics.status === 'APPROVED_WITH_CONDITIONS'
              ? 'Conditional Approval — Disclosures Required'
              : 'Hold: High Risk Flags Detected'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {ethics.passedChecksCount} of {ethics.totalChecksCount} ethical compliance dimensions passed. Human marketing director sign-off is required to release the campaign media pack for live ad spend.
          </p>
        </div>

        {/* Score & Human Approval Stamp */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center p-4 rounded-xl bg-slate-900/90 border border-purple-500/40">
            <div className="text-2xl font-black text-purple-300 font-['Space_Grotesk']">
              {ethics.complianceScore}%
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
              Safety Score
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${
              campaign.approvedByHuman
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/50 text-amber-300'
            }`}
          >
            {campaign.approvedByHuman ? (
              <>
                <FileCheck className="w-6 h-6 mb-1 text-emerald-400" />
                <span className="text-[11px] font-bold">Sign-Off Verified</span>
              </>
            ) : (
              <>
                <Lock className="w-6 h-6 mb-1 text-amber-400" />
                <span className="text-[11px] font-bold">Sign-Off Required</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 8 Ethics Check Items Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          <span>Detailed Ethical Dimension Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ethics.checks.map((check) => (
            <div
              key={check.id}
              className={`p-5 rounded-2xl border transition-all ${
                check.status === 'COMPLIANT'
                  ? 'bg-slate-900/70 border-slate-800'
                  : check.status === 'WARNING'
                  ? 'bg-amber-950/15 border-amber-500/40'
                  : 'bg-rose-950/15 border-rose-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-white text-sm">{check.title}</h4>
                {getStatusBadge(check.status)}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {check.details}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-indigo-300">
                <span className="font-semibold shrink-0">Action Item:</span>
                <span>{check.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Human Marketing Director Sign-Off Module */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Human Marketing Director Sign-Off & Verification Gate
              </h3>
              <p className="text-xs text-slate-400">
                In adherence to Responsible AI and FTC advertising principles, a human executive must review and authorize distribution.
              </p>
            </div>
          </div>
        </div>

        {campaign.approvedByHuman ? (
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Signed & Verified by Human Marketing Director
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                {campaign.approvedByHuman.approverName} —{' '}
                <span className="text-slate-300 font-normal">
                  {campaign.approvedByHuman.approvalRole}
                </span>
              </p>
              <div className="text-[11px] font-mono text-slate-400">
                Timestamp: {campaign.approvedByHuman.timestamp} • Hash:{' '}
                <span className="text-indigo-300">{campaign.approvedByHuman.signatureHash}</span>
              </div>
            </div>

            <button
              onClick={handleRevokeSignoff}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
            >
              Modify or Revoke Sign-Off
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Executive Approver Full Name *
                </label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Corporate Role / Title *
                </label>
                <input
                  type="text"
                  value={approverRole}
                  onChange={(e) => setApproverRole(e.target.value)}
                  placeholder="e.g. VP of Global Brand Marketing"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <input
                type="checkbox"
                id="ethics-confirm"
                checked={confirmedTerms}
                onChange={(e) => setConfirmedTerms(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700 mt-0.5 cursor-pointer"
              />
              <label htmlFor="ethics-confirm" className="text-xs text-slate-300 cursor-pointer">
                I certify that I have reviewed the generated text, poster imagery, jingle lyrics, and promotional video storyboard. All product representations and claims conform to verified business standards and include required AI disclosures.
              </label>
            </div>

            <button
              onClick={handleHumanSignoff}
              disabled={!approverName || !approverRole || !confirmedTerms}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Authorize Campaign & Release Media Pack</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
