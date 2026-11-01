import JSZip from 'jszip';
import { CampaignBrief, FullCampaign } from '../types';
import { audioEngine } from './audioEngine';

export async function generateCampaignMediaPackZip(
  brief: CampaignBrief,
  campaign: FullCampaign,
  posterDataUrl?: string
): Promise<Blob> {
  const zip = new JSZip();

  // Folder structure
  const campaignFolder = zip.folder(`${brief.brandName}_${brief.productName}_Campaign_Pack`.replace(/[^a-zA-Z0-9_-]/g, '_'));
  if (!campaignFolder) throw new Error('Could not create zip folder');

  // 1. Executive Summary
  const summaryContent = `# ${brief.brandName} - ${brief.productName}
## AI Multimodal Marketing Campaign Summary
Generated on: ${new Date().toISOString()}
Target Audience: ${brief.targetAudience}
Campaign Objective: ${brief.campaignObjective}
Advertising Tone: ${brief.advertisingTone.toUpperCase()}
Platform Focus: ${brief.marketingPlatform}
Consistency Score: ${campaign.consistency.overallScore}/100
Ethics Compliance Score: ${campaign.ethics.complianceScore}/100

---
### Campaign Tagline
> "${campaign.overview.tagline}"

### Executive Overview
${campaign.overview.summary}

### Core Value Pillars
${campaign.overview.corePillars.map((p, i) => `${i + 1}. ${p}`).join('\n')}

### Human Marketing Director Sign-Off
${campaign.approvedByHuman ? `Signed by: ${campaign.approvedByHuman.approverName} (${campaign.approvedByHuman.approvalRole})\nTimestamp: ${campaign.approvedByHuman.timestamp}\nVerification Hash: ${campaign.approvedByHuman.signatureHash}` : 'Status: PENDING HUMAN DIRECTOR SIGN-OFF'}
`;
  campaignFolder.file('00_EXECUTIVE_SUMMARY.md', summaryContent);

  // 2. Marketing Copy
  const copyContent = `# Marketing Copy & Social Assets
Brand: ${brief.brandName}
Product: ${brief.productName}

========================================
CAMPAIGN HEADLINES
========================================
${campaign.copy.headlines.map((h, i) => `[Option ${i + 1}] ${h}`).join('\n')}

========================================
PRODUCT DESCRIPTIONS
========================================
[Short Version]:
${campaign.copy.descriptions.short}

[Long Version]:
${campaign.copy.descriptions.long}

========================================
SOCIAL MEDIA POSTS & CAPTIONS
========================================
--- Instagram Caption ---
${campaign.copy.promotionalCaptions.instagram}

--- LinkedIn Update ---
${campaign.copy.promotionalCaptions.linkedin}

--- Twitter / X Post ---
${campaign.copy.promotionalCaptions.twitter}

========================================
ADVERTISING SLOGANS & TAGLINES
========================================
${campaign.copy.slogans.map((s, i) => `• ${s}`).join('\n')}

========================================
RECOMMENDED HASHTAGS
========================================
${campaign.copy.hashtags.join(' ')}

========================================
CALLS TO ACTION (CTA)
========================================
${campaign.copy.callToActions.map((c) => `→ ${c}`).join('\n')}
`;
  campaignFolder.file('01_MARKETING_COPY.txt', copyContent);

  // 3. Poster Image & Specifications
  const posterMeta = `# Poster & Advertisement Image Specifications
Headline: ${campaign.poster.headline}
Subheadline: ${campaign.poster.subheadline}
Badge: ${campaign.poster.badgeText}
CTA Button: ${campaign.poster.callToAction}

--- AI Image Generation Prompt ---
${campaign.poster.visualPrompt}

--- Brand Color Configuration ---
Primary: ${brief.primaryColor}
Secondary: ${brief.secondaryColor}
Accent: ${brief.accentColor}
`;
  campaignFolder.file('02_POSTER_SPECIFICATIONS.txt', posterMeta);

  if (posterDataUrl && posterDataUrl.startsWith('data:image/')) {
    const base64Data = posterDataUrl.split(',')[1];
    campaignFolder.file('poster_advertisement.png', base64Data, { base64: true });
  }

  // 4. Jingle Audio & Lyrics
  const jingleMeta = `# Advertising Jingle & Sonic Branding
Title: ${campaign.jingle.title}
Musical Style: ${campaign.jingle.musicalStyle}
Tempo: ${campaign.jingle.tempoBpm} BPM
Key Signature: ${campaign.jingle.keySignature}
Voice Direction: ${campaign.jingle.voiceDirection}

--- Sonic Generation Prompt ---
${campaign.jingle.prompt}

--- Synchronized Lyrics Timeline ---
${campaign.jingle.lyrics.map((l) => `[${l.time}] ${l.line}`).join('\n')}
`;
  campaignFolder.file('03_JINGLE_LYRICS_AND_PROMPT.txt', jingleMeta);

  // Render and export the actual WAV audio file
  try {
    const audioBlob = await audioEngine.exportWavBlob({
      style: campaign.jingle.musicalStyle,
      tempoBpm: campaign.jingle.tempoBpm,
      durationSeconds: 15,
    });
    campaignFolder.file('advertising_jingle_15s.wav', audioBlob);
  } catch (err) {
    console.warn('Could not generate WAV for zip:', err);
  }

  // 5. Short Video Storyboard & Script
  const videoContent = `# Short Promotional Video Storyboard
Title: ${campaign.video.title}
Format: ${campaign.video.format}
Total Duration: ${campaign.video.totalDurationSeconds} Seconds
Voiceover Persona: ${campaign.video.voiceoverStyle}

==================================================
SCENE-BY-SCENE STORYBOARD
==================================================
${campaign.video.scenes
  .map(
    (s) => `[Scene ${s.sceneNumber}: ${s.title}] (${s.duration}s | Transition: ${s.transition})
- Visual Scene: ${s.visualDescription}
- On-Screen Subtitle: "${s.onScreenText}"
- Voiceover Audio: "${s.voiceover}"
`
  )
  .join('\n--------------------------------------------------\n')}
`;
  campaignFolder.file('04_VIDEO_STORYBOARD.md', videoContent);

  // 6. Cross-Format Consistency Audit
  const consistencyContent = `# Cross-Format Consistency Matrix Report
Overall Consistency Score: ${campaign.consistency.overallScore} / 100
Evaluation Summary: ${campaign.consistency.summary}

| Criteria | Text Copy | Poster Image | Audio Jingle | Video Script | Finding & Recommendation |
| :--- | :---: | :---: | :---: | :---: | :--- |
${campaign.consistency.matrix
  .map(
    (row) =>
      `| ${row.criteria} | **${row.textResult}** | **${row.posterResult}** | **${row.jingleResult}** | **${row.videoResult}** | ${row.finding} _(Rec: ${row.recommendation})_ |`
  )
  .join('\n')}
`;
  campaignFolder.file('05_CONSISTENCY_AUDIT_REPORT.md', consistencyContent);
  campaignFolder.file('consistency_matrix.json', JSON.stringify(campaign.consistency, null, 2));

  // 7. Ethics & Responsible AI Review
  const ethicsContent = `# AI Ethics and Responsible Marketing Review
Compliance Score: ${campaign.ethics.complianceScore} / 100
Checks Passed: ${campaign.ethics.passedChecksCount} of ${campaign.ethics.totalChecksCount}
Overall Status: ${campaign.ethics.status}
Human Marketing Director Sign-Off Required: ${campaign.ethics.humanSignoffRequired ? 'YES' : 'NO'}

## Audit Checklist
${campaign.ethics.checks
  .map(
    (c, i) => `### ${i + 1}. ${c.title}
- Status: **${c.status}** (Severity: ${c.severity.toUpperCase()})
- Analysis: ${c.details}
- Action Item: ${c.recommendation}
`
  )
  .join('\n')}

---
Verified in accordance with Responsible AI Marketing Standards.
`;
  campaignFolder.file('06_ETHICS_AND_RESPONSIBLE_AI_REVIEW.md', ethicsContent);
  campaignFolder.file('ethics_report.json', JSON.stringify(campaign.ethics, null, 2));

  return await zip.generateAsync({ type: 'blob' });
}
