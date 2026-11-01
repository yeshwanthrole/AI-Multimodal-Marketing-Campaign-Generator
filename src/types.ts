export type AdvertisingTone = 'professional' | 'modern' | 'creative' | 'energetic' | 'friendly';

export type MarketingPlatform = 'Instagram' | 'YouTube' | 'Facebook' | 'TikTok' | 'LinkedIn' | 'Multi-Channel';

export interface CampaignBrief {
  brandName: string;
  productName: string;
  productDescription: string;
  keyFeatures: string[];
  targetAudience: string;
  campaignObjective: string;
  marketingPlatform: MarketingPlatform;
  preferredLanguage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  advertisingTone: AdvertisingTone;
  approvedClaims: string[];
  callToAction: string;
  offerDetails?: string;
  pricePoint?: string;
}

export interface CampaignCopy {
  headlines: string[];
  descriptions: {
    short: string;
    long: string;
  };
  promotionalCaptions: {
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  slogans: string[];
  hashtags: string[];
  callToActions: string[];
}

export interface PosterConfig {
  headline: string;
  subheadline: string;
  badgeText: string;
  callToAction: string;
  visualPrompt: string;
  recommendedTemplates: string[];
  layoutConfig: {
    accentGlow: boolean;
    showBadge: boolean;
    textColor: string;
    accentColor: string;
    primaryColor: string;
    secondaryColor: string;
    style?: 'modern_minimalist' | 'bold_editorial' | 'cyber_neon' | 'lifestyle_vibrant';
    aspectRatio?: '1:1' | '4:5' | '9:16' | '16:9';
  };
}

export interface JingleLyric {
  time: string;
  line: string;
}

export interface JingleData {
  title: string;
  musicalStyle: string;
  tempoBpm: number;
  keySignature: string;
  voiceDirection: string;
  lyrics: JingleLyric[];
  prompt: string;
}

export interface VideoScene {
  sceneNumber: number;
  duration: number;
  title: string;
  visualDescription: string;
  onScreenText: string;
  voiceover: string;
  transition: string;
}

export interface VideoData {
  title: string;
  format: string;
  totalDurationSeconds: number;
  voiceoverStyle: string;
  scenes: VideoScene[];
  recommendedBgm?: string;
}

export type ConsistencyResult = 'PASS' | 'REVIEW' | 'FAIL';

export interface ConsistencyCriteriaItem {
  criteria: string;
  textResult: ConsistencyResult;
  posterResult: ConsistencyResult;
  jingleResult: ConsistencyResult;
  videoResult: ConsistencyResult;
  finding: string;
  recommendation: string;
}

export interface ConsistencyReport {
  overallScore: number;
  summary: string;
  matrix: ConsistencyCriteriaItem[];
}

export type EthicsStatus = 'COMPLIANT' | 'WARNING' | 'FLAGGED';

export interface EthicsCheckItem {
  id: string;
  title: string;
  status: EthicsStatus;
  severity: 'low' | 'medium' | 'high';
  details: string;
  recommendation: string;
}

export interface EthicsReport {
  complianceScore: number;
  passedChecksCount: number;
  totalChecksCount: number;
  status: 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'REJECTED';
  humanSignoffRequired: boolean;
  checks: EthicsCheckItem[];
}

export interface FullCampaign {
  overview: {
    tagline: string;
    summary: string;
    corePillars: string[];
  };
  copy: CampaignCopy;
  poster: PosterConfig;
  jingle: JingleData;
  video: VideoData;
  consistency: ConsistencyReport;
  ethics: EthicsReport;
  approvedByHuman?: {
    approverName: string;
    approvalRole: string;
    timestamp: string;
    signatureHash: string;
  };
}

export type ActiveTab =
  | 'setup'
  | 'overview'
  | 'copy'
  | 'poster'
  | 'jingle'
  | 'video'
  | 'consistency'
  | 'ethics'
  | 'mediapack';
