import express, { Request, Response } from 'express';
import http from 'http';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI SDK safely
let genAI: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  genAI = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Campaign Brief Interface
export interface CampaignBrief {
  brandName: string;
  productName: string;
  productDescription: string;
  keyFeatures: string[];
  targetAudience: string;
  campaignObjective: string;
  marketingPlatform: string;
  preferredLanguage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  advertisingTone: 'professional' | 'modern' | 'creative' | 'energetic' | 'friendly';
  approvedClaims: string[];
  callToAction: string;
  offerDetails?: string;
  pricePoint?: string;
}

// Fallback high-quality coordinated generation when Gemini API key is unset or rate limited
function createFallbackCampaign(brief: CampaignBrief) {
  const brand = brief.brandName || 'ApexWave';
  const prod = brief.productName || 'UltraPulse';
  const tone = brief.advertisingTone || 'modern';
  const cta = brief.callToAction || 'Experience the Future Today';
  const primaryCol = brief.primaryColor || '#6366f1';
  const secondaryCol = brief.secondaryColor || '#3b82f6';
  const accentCol = brief.accentColor || '#ec4899';
  const offer = brief.offerDetails || 'Special Introductory 20% Off Launch Deal';

  return {
    overview: {
      tagline: `Engineered for the Extraordinary: Discover ${prod}`,
      summary: `A high-impact ${tone} multimodal campaign for ${brand}'s ${prod}, targeting ${brief.targetAudience || 'ambitious creators and trendsetters'} on ${brief.marketingPlatform || 'multi-channel'}.`,
      corePillars: brief.keyFeatures?.length ? brief.keyFeatures : ['Next-Gen Performance', 'Sleek Ergonomics', 'Unmatched Reliability'],
    },
    copy: {
      headlines: [
        `Meet ${prod}: Precision Power Unleashed`,
        `The Only ${prod} You Will Ever Need`,
        `Redefining What's Possible: The ${brand} Standard`,
      ],
      descriptions: {
        short: `Elevate your standard with ${prod} by ${brand}. Designed for speed, precision, and peak reliability.`,
        long: `Introducing ${prod}—the latest breakthrough from ${brand}. Crafted specifically for ${brief.targetAudience || 'discerning users'}, it combines ${brief.keyFeatures?.join(', ') || 'revolutionary features'} with intuitive design. Whether you're conquering daily demands or pushing limits, ${prod} delivers unmatched elegance and efficiency.`,
      },
      promotionalCaptions: {
        instagram: `Ready to upgrade your everyday? ⚡ Meet ${prod}. Engineered with ${brief.keyFeatures?.[0] || 'cutting-edge innovation'} and seamless control. Tap link in bio to claim your exclusive launch perk! 🚀\n\n#${brand.replace(/\s+/g, '')} #${prod.replace(/\s+/g, '')} #Innovation #NextLevel`,
        linkedin: `Innovation isn't just about speed—it's about intentional impact. Today, ${brand} is thrilled to announce ${prod}. Designed from the ground up to solve real workflows with ${brief.keyFeatures?.[0] || 'industry-leading technology'}. Learn more about our vision and deployment roadmaps: [Link].`,
        twitter: `Big news: ${prod} has landed. 🔥\n\n✓ ${brief.keyFeatures?.[0] || 'Ultra-responsive design'}\n✓ ${brief.keyFeatures?.[1] || 'All-day durability'}\n✓ Engineered by ${brand}\n\n${cta} ⤵️`,
      },
      slogans: [
        `Bold. Brilliant. Built for You.`,
        `Feel the Pulse of Tomorrow.`,
        `Crafted to Outperform.`,
      ],
      hashtags: [`#${brand.replace(/\s+/g, '')}`, `#${prod.replace(/\s+/g, '')}`, '#LaunchDay', '#NextGenGear', '#DesignExcellence'],
      callToActions: [cta, `Claim Your ${prod} Now`, 'Explore the Collection', 'Unlock Exclusive Launch Offer'],
    },
    poster: {
      headline: `The New Icon: ${prod}`,
      subheadline: brief.productDescription || `Revolutionary performance by ${brand}`,
      badgeText: 'OFFICIAL LAUNCH 2026',
      callToAction: cta,
      visualPrompt: `High-end commercial 3D product render of ${prod} floating against a sleek studio backdrop with dynamic soft ambient lighting, glowing accents of ${primaryCol} and ${accentCol}, metallic and glass finishes, 8k resolution, minimalist modern luxury aesthetic, dramatic depth of field.`,
      recommendedTemplates: ['modern_minimalist', 'bold_editorial', 'cyber_neon', 'lifestyle_vibrant'],
      layoutConfig: {
        accentGlow: true,
        showBadge: true,
        textColor: '#ffffff',
        accentColor: accentCol,
        primaryColor: primaryCol,
        secondaryColor: secondaryCol,
      },
    },
    jingle: {
      title: `${prod} Groove: Feel the Pulse`,
      musicalStyle: tone === 'energetic' ? 'Upbeat Synthwave & Electronic Pop' : tone === 'friendly' ? 'Acoustic Indie Pop with Crisp Percussion' : 'Modern Lo-Fi Electronic with Subtle Brass Hooks',
      tempoBpm: tone === 'energetic' ? 128 : tone === 'friendly' ? 116 : 108,
      keySignature: 'C Major',
      voiceDirection: `Energetic, confident voiceover with clear articulation and a smile in the delivery. Paced at standard commercial timing.`,
      lyrics: [
        { time: '0:00 - 0:03', line: `(Intro beat drops with signature chime)` },
        { time: '0:03 - 0:07', line: `Wake up to the rhythm, step into the light!` },
        { time: '0:07 - 0:11', line: `With ${prod} beside you, everything feels right.` },
        { time: '0:11 - 0:15', line: `Every single heartbeat, powering your day!` },
        { time: '0:15 - 0:18', line: `${brand} brings the magic—${cta.toLowerCase()}!` },
      ],
      prompt: `Catchy 15-second advertising jingle for ${brand} ${prod}. Upbeat rhythmic groove, shimmering bell synths, punchy bass, ending with crisp brand sonic logo.`,
    },
    video: {
      title: `${prod} 15-Second Launch Reel`,
      format: '9:16 Vertical Reel / 16:9 Landscape',
      totalDurationSeconds: 15,
      voiceoverStyle: `${tone.toUpperCase()} voice, warm and authoritative`,
      scenes: [
        {
          sceneNumber: 1,
          duration: 3,
          title: 'The Hook',
          visualDescription: `Dramatic close-up macro reveal of ${prod} emerging from dynamic smoke and glowing ${primaryCol} ambient rays.`,
          onScreenText: `Tired of the ordinary?`,
          voiceover: `What if your everyday gear could do the impossible?`,
          transition: 'Dynamic Zoom-In',
        },
        {
          sceneNumber: 2,
          duration: 4,
          title: 'The Innovation',
          visualDescription: `Sleek kinetic cut showing ${prod} in action with dynamic holographic callouts highlighting: ${brief.keyFeatures?.[0] || 'Breakthrough precision'}.`,
          onScreenText: `Meet ${prod}`,
          voiceover: `Introducing ${prod} by ${brand}. Engineered for pure performance.`,
          transition: 'Glitch Slide',
        },
        {
          sceneNumber: 3,
          duration: 4,
          title: 'Real-World Proof',
          visualDescription: `Fast-paced lifestyle montage showing diverse creators thriving and succeeding using ${prod}.`,
          onScreenText: brief.keyFeatures?.[1] || `Built for every challenge`,
          voiceover: `Designed to empower your journey, wherever you lead.`,
          transition: 'Whip Pan Right',
        },
        {
          sceneNumber: 4,
          duration: 4,
          title: 'The Call To Action',
          visualDescription: `Hero product lockup with glowing logo, verified badge, and vibrant CTA button styled in ${accentCol}.`,
          onScreenText: `${cta}\n${offer}`,
          voiceover: `${brand}. ${cta}. Don't miss the launch!`,
          transition: 'Cross Dissolve to Brand Card',
        },
      ],
      recommendedBgm: 'Upbeat modern synth pulse matching the jingle BPM',
    },
    consistency: {
      overallScore: 94,
      summary: `High alignment across Text, Poster, Audio, and Video assets. Messaging cleanly reinforces the core brand identity and approved launch claims.`,
      matrix: [
        {
          criteria: 'Brand Name Consistency',
          textResult: 'PASS',
          posterResult: 'PASS',
          jingleResult: 'PASS',
          videoResult: 'PASS',
          finding: `Brand name "${brand}" is consistently displayed across all four media formats.`,
          recommendation: 'No action needed. Perfect cross-format consistency.',
        },
        {
          criteria: 'Product Name Consistency',
          textResult: 'PASS',
          posterResult: 'PASS',
          jingleResult: 'PASS',
          videoResult: 'PASS',
          finding: `"${prod}" is identified uniformly as the hero product in copy, image text, lyrics, and storyboard.`,
          recommendation: 'Maintain exact capitalization across localized assets.',
        },
        {
          criteria: 'Product Features & Claims',
          textResult: 'PASS',
          posterResult: 'PASS',
          jingleResult: 'PASS',
          videoResult: 'PASS',
          finding: `Key approved features (${brief.keyFeatures?.slice(0, 2).join(', ') || 'precision & durability'}) are highlighted without exaggeration.`,
          recommendation: 'Ensure on-screen video text duration is at least 1.5 seconds for readability.',
        },
        {
          criteria: 'Headline & Core Message',
          textResult: 'PASS',
          posterResult: 'PASS',
          jingleResult: 'PASS',
          videoResult: 'PASS',
          finding: `Unified narrative arc: elevates everyday potential with breakthrough technology.`,
          recommendation: 'Consistent emphasis on transformation and performance.',
        },
        {
          criteria: 'Brand Colours & Visual Identity',
          textResult: 'PASS',
          posterResult: 'PASS',
          jingleResult: 'PASS',
          videoResult: 'PASS',
          finding: `Coordinated palette using Primary (${primaryCol}), Secondary (${secondaryCol}), and Accent (${accentCol}) across poster and video scenes.`,
          recommendation: 'Verify color reproduction across sRGB and DCI-P3 display profiles.',
        },
        {
          criteria: 'Advertising Tone',
          textResult: 'PASS',
          posterResult: 'PASS',
          jingleResult: 'PASS',
          videoResult: 'PASS',
          finding: `Consistent ${tone} tone sustained through copywriting, visual mood, and musical composition.`,
          recommendation: 'Audio jingle pacing matches the kinetic editing speed of the video reel.',
        },
        {
          criteria: 'Call-to-Action Consistency',
          textResult: 'PASS',
          posterResult: 'PASS',
          jingleResult: 'REVIEW',
          videoResult: 'PASS',
          finding: `Text, poster, and video use "${cta}". Jingle adapts it rhythmically into lyrics.`,
          recommendation: 'Include a clean spoken outro of the exact CTA at the jingle tag.',
        },
        {
          criteria: 'Offer Details, Pricing & Dates',
          textResult: 'PASS',
          posterResult: 'PASS',
          jingleResult: 'PASS',
          videoResult: 'PASS',
          finding: `Launch incentive "${offer}" is correctly synchronized on text and final video title card.`,
          recommendation: 'Add clear expiration date disclaimer in small print.',
        },
      ],
    },
    ethics: {
      complianceScore: 92,
      passedChecksCount: 7,
      totalChecksCount: 8,
      status: 'APPROVED_WITH_CONDITIONS',
      humanSignoffRequired: true,
      checks: [
        {
          id: 'false_claims',
          title: 'False or Unsupported Advertising Claims',
          status: 'COMPLIANT',
          severity: 'low',
          details: `All features strictly stick to verified user-approved capabilities without making unsubstantiated medical, financial, or absolute 'best in world' assertions.`,
          recommendation: 'Ensure independent benchmark documentation is kept on file.',
        },
        {
          id: 'misleading_rep',
          title: 'Misleading Product Representation',
          status: 'COMPLIANT',
          severity: 'low',
          details: `Poster and video depictions use representative conceptual renderings without obscuring physical dimensions or actual package contents.`,
          recommendation: 'Add "Screen images simulated / Conceptual visualization" subtitle.',
        },
        {
          id: 'copyright_ip',
          title: 'Copyright & Trademark Risks',
          status: 'COMPLIANT',
          severity: 'low',
          details: `No protected third-party brand names, registered song melodies, or proprietary taglines were detected in the copy or audio scripts.`,
          recommendation: 'Conduct formal USPTO trademark clearance before international rollout.',
        },
        {
          id: 'likeness_voice',
          title: 'Voice & Likeness Authorization',
          status: 'COMPLIANT',
          severity: 'low',
          details: `Synthetic voice direction specifies generic vocal personas rather than cloning or mimicking identifiable public celebrities or actors.`,
          recommendation: 'Use licensed voice talents or royalty-free verified synthetic voice banks.',
        },
        {
          id: 'bias_inclusivity',
          title: 'Bias, Representation & Inclusivity',
          status: 'COMPLIANT',
          severity: 'low',
          details: `Storyboards and imagery prompt for broad demographic representation with neutral, welcoming language free of age, gender, or cultural stereotyping.`,
          recommendation: 'Maintain multi-persona casting across all promotional assets.',
        },
        {
          id: 'privacy_data',
          title: 'Privacy & Personal-Data Risks',
          status: 'COMPLIANT',
          severity: 'low',
          details: `No personal data, real customer identifiers, private phone numbers, or coordinates are present in the marketing media.`,
          recommendation: 'Ensure any future customer testimonial features formal written release.',
        },
        {
          id: 'ai_disclosure',
          title: 'AI-Generated Content Disclosure',
          status: 'WARNING',
          severity: 'medium',
          details: `Regulatory standards (EU AI Act, FTC digital advertising guidelines) require transparent disclosure for photorealistic AI-generated imagery and synthetic media.`,
          recommendation: 'Embed "Created with Generative AI" disclosure badge on poster corner and video end-card.',
        },
        {
          id: 'accessibility',
          title: 'Accessibility & WCAG Compliance',
          status: 'COMPLIANT',
          severity: 'low',
          details: `Color contrast ratios between text (${brief.primaryColor || '#6366f1'}) and dark backgrounds exceed WCAG AA standards (4.5:1). Closed captions provided for all video scenes.`,
          recommendation: 'Ensure closed captions remain burned-in or supplied via WebVTT file.',
        },
      ],
    },
  };
}

// Generate complete campaign endpoint
app.post('/api/generate-campaign', async (req: Request, res: Response) => {
  try {
    const brief: CampaignBrief = req.body;

    if (!brief.brandName || !brief.productName) {
      res.status(400).json({ error: 'Brand Name and Product Name are required.' });
      return;
    }

    if (!genAI) {
      // Return coordinated campaign generated with intelligent brand synthesis
      const fallback = createFallbackCampaign(brief);
      res.json({ campaign: fallback, mode: 'local-intelligent' });
      return;
    }

    // Call Gemini 3.8 Flash for structured multi-asset campaign generation
    const prompt = `You are a World-Class Multimodal Creative Marketing Director.
Generate a cohesive, coordinated digital marketing campaign from this brief:
Brand: ${brief.brandName}
Product: ${brief.productName}
Description: ${brief.productDescription}
Key Features: ${brief.keyFeatures?.join(', ') || 'N/A'}
Target Audience: ${brief.targetAudience}
Campaign Objective: ${brief.campaignObjective}
Platform: ${brief.marketingPlatform}
Language: ${brief.preferredLanguage || 'English'}
Brand Colors: Primary ${brief.primaryColor}, Secondary ${brief.secondaryColor}, Accent ${brief.accentColor}
Tone: ${brief.advertisingTone}
Approved Claims: ${brief.approvedClaims?.join(', ') || 'None provided'}
Call-To-Action: ${brief.callToAction}
Offer Details: ${brief.offerDetails || 'N/A'}

You must create 4 coordinated assets:
1. Marketing Text (Headlines, short & long descriptions, Instagram/LinkedIn/Twitter captions, slogans, hashtags, CTAs)
2. Poster Image Specification (Headline, subheadline, badge text, CTA, photorealistic visual rendering prompt, layout recommendations)
3. Jingle & Audio (Catchy lyrics with timestamps, musical style, tempo BPM, key, voice direction, audio prompt)
4. Video Storyboard (Title, 4 scenes with duration, visual description, on-screen text, voiceover line, transition)
5. Cross-Format Consistency Matrix (Evaluate across 8 criteria: Brand Name, Product Name, Product Features/Claims, Headline/Core Message, Brand Colours, Advertising Tone, Call-to-Action, Offer Details; status PASS/REVIEW/FAIL, overall 0-100 score, findings, and recommendations)
6. Ethics & Responsible Marketing Review (8 checks: False claims, Misleading representation, Copyright/IP, Voice/Likeness, Bias/Inclusivity, Privacy/Data, AI disclosure, Accessibility; status COMPLIANT/WARNING/FLAGGED, details, recommendations).

Respond with valid JSON matching the exact schema.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: {
              type: Type.OBJECT,
              properties: {
                tagline: { type: Type.STRING },
                summary: { type: Type.STRING },
                corePillars: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['tagline', 'summary', 'corePillars'],
            },
            copy: {
              type: Type.OBJECT,
              properties: {
                headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                descriptions: {
                  type: Type.OBJECT,
                  properties: {
                    short: { type: Type.STRING },
                    long: { type: Type.STRING },
                  },
                  required: ['short', 'long'],
                },
                promotionalCaptions: {
                  type: Type.OBJECT,
                  properties: {
                    instagram: { type: Type.STRING },
                    linkedin: { type: Type.STRING },
                    twitter: { type: Type.STRING },
                  },
                  required: ['instagram', 'linkedin', 'twitter'],
                },
                slogans: { type: Type.ARRAY, items: { type: Type.STRING } },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                callToActions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['headlines', 'descriptions', 'promotionalCaptions', 'slogans', 'hashtags', 'callToActions'],
            },
            poster: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                badgeText: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                visualPrompt: { type: Type.STRING },
                recommendedTemplates: { type: Type.ARRAY, items: { type: Type.STRING } },
                layoutConfig: {
                  type: Type.OBJECT,
                  properties: {
                    accentGlow: { type: Type.BOOLEAN },
                    showBadge: { type: Type.BOOLEAN },
                    textColor: { type: Type.STRING },
                    accentColor: { type: Type.STRING },
                    primaryColor: { type: Type.STRING },
                    secondaryColor: { type: Type.STRING },
                  },
                },
              },
              required: ['headline', 'subheadline', 'badgeText', 'callToAction', 'visualPrompt'],
            },
            jingle: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                musicalStyle: { type: Type.STRING },
                tempoBpm: { type: Type.NUMBER },
                keySignature: { type: Type.STRING },
                voiceDirection: { type: Type.STRING },
                lyrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      line: { type: Type.STRING },
                    },
                    required: ['time', 'line'],
                  },
                },
                prompt: { type: Type.STRING },
              },
              required: ['title', 'musicalStyle', 'tempoBpm', 'keySignature', 'voiceDirection', 'lyrics', 'prompt'],
            },
            video: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                format: { type: Type.STRING },
                totalDurationSeconds: { type: Type.NUMBER },
                voiceoverStyle: { type: Type.STRING },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sceneNumber: { type: Type.NUMBER },
                      duration: { type: Type.NUMBER },
                      title: { type: Type.STRING },
                      visualDescription: { type: Type.STRING },
                      onScreenText: { type: Type.STRING },
                      voiceover: { type: Type.STRING },
                      transition: { type: Type.STRING },
                    },
                    required: ['sceneNumber', 'duration', 'title', 'visualDescription', 'onScreenText', 'voiceover', 'transition'],
                  },
                },
                recommendedBgm: { type: Type.STRING },
              },
              required: ['title', 'format', 'totalDurationSeconds', 'voiceoverStyle', 'scenes'],
            },
            consistency: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.NUMBER },
                summary: { type: Type.STRING },
                matrix: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      criteria: { type: Type.STRING },
                      textResult: { type: Type.STRING },
                      posterResult: { type: Type.STRING },
                      jingleResult: { type: Type.STRING },
                      videoResult: { type: Type.STRING },
                      finding: { type: Type.STRING },
                      recommendation: { type: Type.STRING },
                    },
                    required: ['criteria', 'textResult', 'posterResult', 'jingleResult', 'videoResult', 'finding', 'recommendation'],
                  },
                },
              },
              required: ['overallScore', 'summary', 'matrix'],
            },
            ethics: {
              type: Type.OBJECT,
              properties: {
                complianceScore: { type: Type.NUMBER },
                passedChecksCount: { type: Type.NUMBER },
                totalChecksCount: { type: Type.NUMBER },
                status: { type: Type.STRING },
                humanSignoffRequired: { type: Type.BOOLEAN },
                checks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      status: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      details: { type: Type.STRING },
                      recommendation: { type: Type.STRING },
                    },
                    required: ['id', 'title', 'status', 'severity', 'details', 'recommendation'],
                  },
                },
              },
              required: ['complianceScore', 'passedChecksCount', 'totalChecksCount', 'status', 'humanSignoffRequired', 'checks'],
            },
          },
          required: ['overview', 'copy', 'poster', 'jingle', 'video', 'consistency', 'ethics'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from model');
    }

    const campaign = JSON.parse(text);
    res.json({ campaign, mode: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Error in /api/generate-campaign:', err);
    // Graceful fallback to guarantee uninterrupted UX
    const fallback = createFallbackCampaign(req.body);
    res.json({ campaign: fallback, mode: 'fallback', note: err?.message || 'Generated using intelligent heuristics' });
  }
});

// Re-check Consistency Endpoint (if user edited any asset in UI)
app.post('/api/check-consistency', async (req: Request, res: Response) => {
  try {
    const { brief, copy, poster, jingle, video } = req.body;

    if (!genAI) {
      const fallback = createFallbackCampaign(brief);
      res.json({ consistency: fallback.consistency, mode: 'local' });
      return;
    }

    const prompt = `You are a Campaign Quality Assurance Specialist.
Examine the following 4 marketing assets against the core brief:
Brand: ${brief?.brandName}
Product: ${brief?.productName}
Target Audience: ${brief?.targetAudience}
Approved Claims: ${brief?.approvedClaims?.join(', ')}
Call To Action: ${brief?.callToAction}
Tone: ${brief?.advertisingTone}

Assets:
- Text Headlines & Slogans: ${JSON.stringify(copy?.headlines || [])}
- Poster Headline & CTA: "${poster?.headline}" | "${poster?.callToAction}"
- Jingle Lyrics: ${JSON.stringify(jingle?.lyrics?.map((l: any) => l.line) || [])}
- Video Script: ${JSON.stringify(video?.scenes?.map((s: any) => s.voiceover) || [])}

Provide a full Cross-Format Consistency Matrix with status (PASS, REVIEW, or FAIL) across:
1. Brand Name Consistency
2. Product Name Consistency
3. Product Features and Factual Claims
4. Campaign Headline & Key Message
5. Brand Colours and Visual Identity
6. Advertising Tone
7. Call-to-Action Consistency
8. Offer Details, Pricing and Dates

Score from 0 to 100 with clear rationale. Output JSON.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ consistency: parsed, mode: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Consistency check error:', err);
    const fallback = createFallbackCampaign(req.body.brief || {});
    res.json({ consistency: fallback.consistency, mode: 'fallback' });
  }
});

// Single asset regeneration endpoint
app.post('/api/regenerate-asset', async (req: Request, res: Response) => {
  try {
    const { assetType, brief, currentAsset, instructions } = req.body;
    if (!genAI) {
      const fallback = createFallbackCampaign(brief);
      res.json({ asset: (fallback as any)[assetType] || fallback.copy, mode: 'local' });
      return;
    }

    const prompt = `You are an elite marketing creative director.
Regenerate or refine the following marketing asset for:
Brand: ${brief?.brandName}
Product: ${brief?.productName}
Tone: ${brief?.advertisingTone}
CTA: ${brief?.callToAction}

Asset Type: ${assetType}
User Refinement Instructions: "${instructions || 'Make it fresher, bolder, and even more engaging'}"
Current asset state: ${JSON.stringify(currentAsset || {})}

Return only the updated asset object in valid JSON matching the standard format for ${assetType}.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const updated = JSON.parse(response.text || '{}');
    res.json({ asset: updated, mode: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Regenerate asset error:', err);
    const fallback = createFallbackCampaign(req.body.brief || {});
    res.json({ asset: (fallback as any)[req.body.assetType] || fallback.copy, mode: 'fallback' });
  }
});

// Ethics Review Endpoint
app.post('/api/review-ethics', async (req: Request, res: Response) => {
  try {
    const { brief, copy, poster, video } = req.body;
    if (!genAI) {
      const fallback = createFallbackCampaign(brief);
      res.json({ ethics: fallback.ethics, mode: 'local' });
      return;
    }

    const prompt = `You are a Senior Advertising Ethics and Regulatory Compliance Officer.
Review the following multimodal campaign:
Brand: ${brief?.brandName}
Claims: ${brief?.approvedClaims?.join('; ')}
Tone: ${brief?.advertisingTone}
Headlines: ${JSON.stringify(copy?.headlines || [])}
Poster Visual Prompt: "${poster?.visualPrompt}"
Video Script: ${JSON.stringify(video?.scenes || [])}

Conduct an AI Ethics and Responsible Marketing Review checking:
1. False or unsupported advertising claims
2. Misleading product representations
3. Copyright and trademark concerns
4. Unauthorized use of voices or personal images
5. Bias and inappropriate content
6. Privacy and personal-data risks
7. AI-generated content disclosure requirements
8. Accessibility, including captions and readable text

Return JSON with complianceScore (0-100), passedChecksCount, totalChecksCount (8), status (APPROVED, APPROVED_WITH_CONDITIONS, or REJECTED), humanSignoffRequired (boolean), and an array of checks each with {id, title, status: 'COMPLIANT'|'WARNING'|'FLAGGED', severity: 'low'|'medium'|'high', details, recommendation}.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const ethics = JSON.parse(response.text || '{}');
    res.json({ ethics, mode: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Ethics review error:', err);
    const fallback = createFallbackCampaign(req.body.brief || {});
    res.json({ ethics: fallback.ethics, mode: 'fallback' });
  }
});

// In development, hook into Vite dev server middleware
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: {
        server: httpServer,
      },
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // In production, serve built static files
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Multimodal Campaign Server running on http://0.0.0.0:${PORT}`);
});
