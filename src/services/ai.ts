import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePostContent(
  topic: string,
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram',
  tone: 'professional' | 'casual' | 'humorous' | 'inspiring' = 'professional',
  hashtags: boolean = true
): Promise<{ content: string; hashtags: string[] }> {
  const platformInstructions: Record<string, string> = {
    twitter: '280 characters max, concise, use 1-3 relevant hashtags, can use emojis',
    linkedin: 'Professional tone, longer form (500-1000 chars), 3-5 hashtags, include industry insights',
    facebook: 'Conversational, engaging, 2-4 hashtags, encourage comments/shares',
    instagram: 'Visual-first, engaging caption, 5-10 hashtags, include CTA',
  };

  const toneInstructions: Record<string, string> = {
    professional: 'Formal, industry-focused, authoritative',
    casual: 'Relaxed, friendly, conversational',
    humorous: 'Witty, light-hearted, funny',
    inspiring: 'Motivational, uplifting, empowering',
  };

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a social media content expert. Generate engaging content for ${platform}.

Platform guidelines: ${platformInstructions[platform]}
Tone: ${toneInstructions[tone]}

${hashtags ? 'Include relevant hashtags at the end (format: #hashtag1 #hashtag2)' : 'Do not include hashtags'}

Return the response in this format:
CONTENT: [your content here]
HASHTAGS: [comma separated list if applicable, or "none"]`,
      },
      {
        role: 'user',
        content: `Topic: ${topic}\nPlatform: ${platform}\nTone: ${tone}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const result = response.choices[0]?.message?.content || '';

  // Parse the response
  let content = result;
  let hashtagList: string[] = [];

  const contentMatch = result.match(/CONTENT:\s*([\s\S]*?)(?=\nHASHTAGS:|$)/i);
  const hashtagsMatch = result.match(/HASHTAGS:\s*(.+)(?=\n|$)/i);

  if (contentMatch) {
    content = contentMatch[1].trim();
  }

  if (hashtagsMatch && hashtagsMatch[1].toLowerCase() !== 'none') {
    hashtagList = hashtagsMatch[1]
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.startsWith('#') || tag);
  }

  // If no hashtags found but hashtags requested, extract from content
  if (hashtagList.length === 0 && hashtags) {
    const tagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = content.match(tagRegex);
    if (matches) {
      hashtagList = matches;
    }
  }

  return { content, hashtags: hashtagList };
}

export async function improvePost(
  originalContent: string,
  platform: string,
  goals: 'more_engagement' | 'more_clicks' | 'more_shares' | 'more_comments' = 'more_engagement'
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a social media optimization expert. Improve the given post to maximize ${goals.replace('_', ' ')} for ${platform}.

Keep the core message but make it more engaging, impactful, and optimized for the platform.`,
      },
      {
        role: 'user',
        content: `Original post:\n${originalContent}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content || originalContent;
}

export async function generatePostVariations(
  content: string,
  count: number = 3
): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Generate ${count} different variations of the given post. Each variation should have a different angle/tone while keeping the core message.

Return each variation on a new line starting with "VARIATION 1:", "VARIATION 2:", etc.`,
      },
      {
        role: 'user',
        content: `Original post:\n${content}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 600,
  });

  const result = response.choices[0]?.message?.content || '';
  const variations: string[] = [];

  const regex = /VARIATION\s+\d+:\s*([\s\S]*?)(?=\nVARIATION\s+\d+:|$)/gi;
  let match;
  while ((match = regex.exec(result)) !== null) {
    variations.push(match[1].trim());
  }

  return variations.length > 0 ? variations : [content];
}

export async function generateHashtags(
  content: string,
  count: number = 10,
  platform: string = 'twitter'
): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Generate ${count} relevant and trending hashtags for the following content for ${platform}.

Platform guidelines:
- Twitter: 1-3 hashtags, use trending topics
- LinkedIn: 3-5 hashtags, professional and industry-specific
- Facebook: 2-4 hashtags, popular and relevant
- Instagram: 8-30 hashtags, mix of popular, niche, and branded

Return only the hashtags, separated by spaces.`,
      },
      {
        role: 'user',
        content: content,
      },
    ],
    temperature: 0.6,
    max_tokens: 100,
  });

  const result = response.choices[0]?.message?.content || '';
  const tags = result.split(/\s+/).filter((tag) => tag.startsWith('#'));

  return tags.slice(0, count);
}
