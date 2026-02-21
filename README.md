# SocialAI - AI-Powered Social Media Automation

## 🚀 Features

- **AI Content Generation**: Generate engaging posts for Twitter, LinkedIn, Facebook, and Instagram
- **Multi-Platform Support**: Post to all major social media platforms from one dashboard
- **Intelligent Scheduling**: Schedule posts at optimal times for maximum engagement
- **Analytics Dashboard**: Track performance across all platforms
- **Hashtag Generation**: AI-powered hashtag suggestions
- **Tone Adjustment**: Choose the perfect tone for your brand
- **Post Templates**: Save and reuse your best-performing content
- **Campaign Management**: Organize posts into campaigns

## 📦 Installation

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

## 🔑 Required Environment Variables

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

### OpenAI
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Model to use (default: `gpt-4`)

### Social Media APIs
- **Twitter**: `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET`
- **LinkedIn**: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`
- **Facebook**: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`
- **Instagram**: `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

### App
- `NEXT_PUBLIC_APP_URL`: Your app URL

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  posts_per_month INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connected accounts
CREATE TABLE connected_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'instagram')),
  platform_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, platform)
);

-- Social posts
CREATE TABLE social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'instagram')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  hashtags TEXT[],
  scheduled_at TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  platform_post_id TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed')),
  engagement JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post templates
CREATE TABLE post_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content_template TEXT NOT NULL,
  hashtags TEXT[],
  platform TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  target_platforms TEXT[],
  goals JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_connected_accounts_user_id ON connected_accounts(user_id);
CREATE INDEX idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX idx_social_posts_scheduled_at ON social_posts(scheduled_at);
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
```

## 💳 Pricing Tiers

| Tier | Price | Posts/Month | Platforms | Features |
|------|-------|-------------|-----------|----------|
| Free | $0 | 10 | Twitter | Basic analytics, 3 templates |
| Starter | $19/mo | 100 | Twitter, LinkedIn | AI generation, scheduling, 10 templates |
| Professional | $49/mo | 500 | All | Campaigns, unlimited templates, priority support |
| Enterprise | $199/mo | Unlimited | All | Team collaboration, API access, custom integrations |

## 🎯 How to Use

1. **Connect Accounts**: Link your social media accounts in Settings
2. **Generate Content**: Enter a topic and let AI create your post
3. **Customize**: Adjust tone, hashtags, and content
4. **Schedule**: Set the perfect time to post
5. **Track**: Monitor performance with analytics

## 🚀 Deployment

### Deploy to Vercel

```bash
vercel login
vercel
```

### Deploy with Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 API Endpoints

### Posts
- `GET /api/posts` - List posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### AI
- `POST /api/ai/generate` - Generate post content
- `POST /api/ai/improve` - Improve existing post
- `POST /api/ai/hashtags` - Generate hashtags

### Scheduling
- `POST /api/posts/schedule` - Schedule post
- `POST /api/posts/:id/publish` - Publish immediately

## 🤝 Support

For issues and questions, please open a GitHub issue.

## 📄 License

MIT
