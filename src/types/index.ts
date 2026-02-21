// Social Automation Types

export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise';
  posts_per_month: number;
  connected_accounts: ConnectedAccount[];
  created_at: string;
  updated_at: string;
};

export type ConnectedAccount = {
  id: string;
  user_id: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  platform_user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  connected_at: string;
  last_synced?: string;
};

export type SocialPost = {
  id: string;
  user_id: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  content: string;
  media_urls?: string[];
  hashtags: string[];
  scheduled_at?: string;
  posted_at?: string;
  platform_post_id?: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    impressions?: number;
  };
  created_at: string;
  updated_at: string;
};

export type PostTemplate = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  content_template: string; // Can include {{variable}} placeholders
  hashtags: string[];
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'all';
  category: string;
  created_at: string;
};

export type Campaign = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  posts: SocialPost[];
  target_platforms: ('twitter' | 'linkedin' | 'facebook' | 'instagram')[];
  goals: {
    total_posts?: number;
    total_engagement?: number;
    clicks?: number;
    conversions?: number;
  };
  created_at: string;
  updated_at: string;
};

export type Analytics = {
  user_id: string;
  period_start: string;
  period_end: string;
  posts_total: number;
  posts_by_platform: Record<string, number>;
  engagement_total: number;
  engagement_rate: number;
  likes_total: number;
  comments_total: number;
  shares_total: number;
  impressions_total: number;
  top_performing_posts: {
    id: string;
    platform: string;
    content: string;
    engagement: number;
    engagement_rate: number;
  }[];
};

export type SubscriptionTier = {
  id: 'free' | 'starter' | 'professional' | 'enterprise';
  name: string;
  price: number;
  posts_per_month: number;
  platforms: string[];
  features: string[];
  popular?: boolean;
};

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    posts_per_month: 10,
    platforms: ['twitter'],
    features: [
      '10 posts/month',
      '1 connected account',
      'Basic analytics',
      '3 post templates',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    posts_per_month: 100,
    platforms: ['twitter', 'linkedin'],
    features: [
      '100 posts/month',
      '2 connected accounts',
      'AI content generation',
      'Post scheduling',
      '10 post templates',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    posts_per_month: 500,
    platforms: ['twitter', 'linkedin', 'facebook', 'instagram'],
    features: [
      '500 posts/month',
      '5 connected accounts',
      'AI content generation',
      'Advanced scheduling',
      'Campaign management',
      'Unlimited templates',
      'Analytics dashboard',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    posts_per_month: -1, // Unlimited
    platforms: ['twitter', 'linkedin', 'facebook', 'instagram'],
    features: [
      'Unlimited posts',
      'Unlimited accounts',
      'AI content generation',
      'Advanced scheduling',
      'Campaign management',
      'Unlimited templates',
      'Full analytics',
      'Team collaboration',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
];
