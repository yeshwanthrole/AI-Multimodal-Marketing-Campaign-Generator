import { CampaignBrief, FullCampaign } from '../types';

export const CAMPAIGN_PRESETS: { label: string; brief: CampaignBrief }[] = [
  {
    label: 'AeroPulse Smart Running Shoe (Athletic Tech)',
    brief: {
      brandName: 'AeroPulse Athletics',
      productName: 'AeroPulse Nitro-Knit X1',
      productDescription: 'Ultralight responsive carbon-plated running shoe with integrated real-time gait sensor and cloud-adaptive foam cushioning.',
      keyFeatures: [
        'Proprietary Dual-Carbon FlightPlate for 18% greater energy return',
        'Featherweight 190g recycled AeroMesh upper',
        'Real-time Bluetooth cadence and impact biometric tracking',
        'All-weather Continental rubber grip with self-cleaning lugs',
      ],
      targetAudience: 'Marathon runners, weekend joggers, and fitness enthusiasts aged 22-42 seeking PR breakthroughs',
      campaignObjective: 'Product Launch & Pre-order Conversions',
      marketingPlatform: 'Multi-Channel',
      preferredLanguage: 'English',
      primaryColor: '#6366f1', // Indigo
      secondaryColor: '#3b82f6', // Blue
      accentColor: '#f43f5e', // Vibrant Coral / Rose
      advertisingTone: 'energetic',
      approvedClaims: [
        'Tested across 15,000 miles by elite athletes',
        'Clinically measured 18% bounce increase vs standard EVA',
        'Certified 100% Post-Consumer Recycled upper yarn',
      ],
      callToAction: 'Unlock Your Personal Best — Pre-Order Now',
      offerDetails: 'Early Access: Receive Free Smart Sensor Pod & 20% Off Launch Price ($189 vs $240)',
      pricePoint: '$189 Launch Special',
    },
  },
  {
    label: 'NovaGlow Vitamin C Peptide Serum (Clean Skincare)',
    brief: {
      brandName: 'NovaGlow Botanicals',
      productName: 'Luminescent Vitamin C + Copper Peptide Serum',
      productDescription: 'Dermatologist-developed antioxidant serum clinically proven to brighten dull complexion, smooth fine lines, and restore skin barrier in 14 days.',
      keyFeatures: [
        '15% Stabilized THD Ascorbate (Ultra-potent Vitamin C)',
        'Copper Tripeptide-1 for natural collagen synthesis',
        'Hyaluronic Acid 4D hydration matrix',
        'Fragrance-free, 100% vegan & cruelty-free formula',
      ],
      targetAudience: 'Skincare-conscious professionals aged 25-50 looking for clean, science-backed skin luminosity',
      campaignObjective: 'Direct Sales & Brand Awareness',
      marketingPlatform: 'Instagram',
      preferredLanguage: 'English',
      primaryColor: '#8b5cf6', // Violet
      secondaryColor: '#06b6d4', // Cyan
      accentColor: '#f59e0b', // Radiant Amber
      advertisingTone: 'modern',
      approvedClaims: [
        '94% of clinical trial participants reported visible radiance in 14 days',
        'Dermatologist tested on sensitive skin',
        'Zero parabens, silicones, or synthetic dyes',
      ],
      callToAction: 'Reveal Your Purest Glow Today',
      offerDetails: 'Complimentary Deluxe Jade Roller with First 500 Orders + Free Worldwide Express Shipping',
      pricePoint: '$64 / 30ml',
    },
  },
  {
    label: 'CloudSync AI Workflow Suite (B2B SaaS)',
    brief: {
      brandName: 'CloudSync Technologies',
      productName: 'CloudSync Flow 3.0',
      productDescription: 'Enterprise AI orchestration workspace that connects distributed software teams, automates repetitive sprint tasks, and cuts meeting times by 40%.',
      keyFeatures: [
        'Context-aware AI sprint manager and backlog summarizer',
        'Universal live document synchronization across 60+ apps',
        'SOC2 Type II & HIPAA certified enterprise encryption',
        'Automated code reviews and pull-request synthesis',
      ],
      targetAudience: 'CTOs, Engineering Managers, and Product Teams at mid-market to enterprise technology companies',
      campaignObjective: 'Lead Generation & Free Trial Signups',
      marketingPlatform: 'LinkedIn',
      preferredLanguage: 'English',
      primaryColor: '#4f46e5', // Deep Indigo
      secondaryColor: '#2563eb', // Royal Blue
      accentColor: '#10b981', // Emerald
      advertisingTone: 'professional',
      approvedClaims: [
        'Trusted by over 1,200 fast-growing engineering teams',
        'SOC2 Type II enterprise-grade security verified',
        'Saves an average of 6.5 hours per engineer each week',
      ],
      callToAction: 'Start Your 14-Day Free Enterprise Trial',
      offerDetails: 'No credit card required. Includes unlimited seats during pilot and complimentary migration support.',
      pricePoint: '$24/seat/month',
    },
  },
  {
    label: 'BrewCraft Nitro Cold Brew (Artisanal Beverage)',
    brief: {
      brandName: 'BrewCraft Coffee Co.',
      productName: 'Nitro Velvet Midnight Blend',
      productDescription: 'Single-origin Ethiopian Yirgacheffe slow-steeped for 24 hours and infused with micro-nitrogen bubbles for a velvety cascading creamy texture.',
      keyFeatures: [
        '100% Fair-Trade shade-grown Arabica beans',
        'Zero added sugar, dairy-free natural chocolate & blackberry notes',
        'Nitrogen pressurized widget can for instant draught pour',
        'Infused with 180mg natural clean caffeine & L-Theanine',
      ],
      targetAudience: 'Coffee purists, creative professionals, and students craving cafe-quality iced espresso on the go',
      campaignObjective: 'Retail Velocity & Direct-to-Consumer Subscriptions',
      marketingPlatform: 'TikTok',
      preferredLanguage: 'English',
      primaryColor: '#7c3aed', // Purple
      secondaryColor: '#4338ca', // Deep Blue
      accentColor: '#fb923c', // Warm Amber Orange
      advertisingTone: 'creative',
      approvedClaims: [
        '100% Certified Organic & Fair Trade Certified',
        'Zero artificial sweeteners or preservatives',
        'Sustainably packaged in infinitely recyclable aluminum cans',
      ],
      callToAction: 'Taste the Draught Revolution — Grab a 4-Pack',
      offerDetails: 'Subscribe & Save 25% + Free Insulated Cold Tumbler on First Box',
      pricePoint: '$14.99 per 4-pack',
    },
  },
];

export const DEFAULT_BRIEF: CampaignBrief = CAMPAIGN_PRESETS[0].brief;
