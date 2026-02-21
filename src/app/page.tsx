'use client';

import { useState } from 'react';
import { Sparkles, Calendar, BarChart3, Settings, Zap, Plus, Share2, TrendingUp, Users, Globe, Clock } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/types';
import { generatePostContent, generateHashtags } from '@/services/ai';

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'bg-black' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: 'bg-blue-700' },
  { id: 'facebook', name: 'Facebook', icon: 'f', color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
];

const tones = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual' },
  { id: 'humorous', name: 'Humorous' },
  { id: 'inspiring', name: 'Inspiring' },
];

const mockPosts = [
  {
    id: '1',
    platform: 'twitter',
    content: '🚀 Just launched our new AI-powered tool! It generates social media posts in seconds. Check it out! #AI #SocialMedia #Marketing',
    status: 'posted',
    postedAt: '2026-02-20T10:30:00Z',
    engagement: { likes: 42, comments: 8, shares: 15, impressions: 1250 },
  },
  {
    id: '2',
    platform: 'linkedin',
    content: 'Excited to share that we\'ve reached 10,000 users! Thank you to our amazing community for your support.',
    status: 'scheduled',
    scheduledAt: '2026-02-22T09:00:00Z',
  },
  {
    id: '3',
    platform: 'facebook',
    content: 'Pro tip: Post consistently across all platforms. Our AI tool helps you maintain a consistent voice while adapting to each platform\'s unique style.',
    status: 'draft',
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'create' | 'schedule' | 'analytics' | 'settings'>('create');
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;

    setIsGenerating(true);
    try {
      const { content, hashtags } = await generatePostContent(
        topic,
        selectedPlatform as any,
        selectedTone as any,
        true
      );
      setGeneratedContent(content);
      setGeneratedHashtags(hashtags);
    } catch (error) {
      console.error('Error generating post:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateHashtags = async () => {
    const content = generatedContent || topic;
    if (!content) return;

    try {
      const tags = await generateHashtags(content, 10, selectedPlatform);
      setGeneratedHashtags(tags);
    } catch (error) {
      console.error('Error generating hashtags:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  SocialAI
                </h1>
                <p className="text-xs text-gray-600">AI-Powered Social Media</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'create', icon: Sparkles, label: 'Create' },
                { id: 'schedule', icon: Calendar, label: 'Schedule' },
                { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                { id: 'settings', icon: Settings, label: 'Settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'create' && (
          <div className="max-w-6xl mx-auto">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">Total Posts</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">247</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">Engagement</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">12.4K</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">Impressions</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">89.2K</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-600">Scheduled</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create Post */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Create Post with AI
                </h2>

                <div className="space-y-4">
                  {/* Platform Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">Platform</label>
                    <div className="grid grid-cols-4 gap-2">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            selectedPlatform === platform.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xl">{platform.icon}</span>
                          <p className="text-xs mt-1">{platform.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">Tone</label>
                    <div className="flex gap-2">
                      {tones.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => setSelectedTone(tone.id)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                            selectedTone === tone.id
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {tone.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic Input */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">Topic or Keywords</label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="E.g., Launch new AI tool, Tips for productivity..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Generate Post
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Content */}
                {generatedContent && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-purple-700">Generated Content</span>
                      <button
                        onClick={handleGenerateHashtags}
                        className="text-xs px-3 py-1 bg-white border border-purple-300 rounded-full text-purple-700 hover:bg-purple-100 transition-colors"
                      >
                        More Hashtags
                      </button>
                    </div>
                    <p className="text-gray-900 mb-3">{generatedContent}</p>
                    {generatedHashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {generatedHashtags.map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white rounded-full text-purple-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add to Queue
                      </button>
                      <button className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                        Save Draft
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Posts</h2>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {mockPosts.map((post) => (
                    <div key={post.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            post.status === 'posted' ? 'bg-green-100 text-green-700' :
                            post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-sm text-gray-600 capitalize">{post.platform}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          •••
                        </button>
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-3 mb-2">{post.content}</p>
                      {post.engagement && (
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>❤️ {post.engagement.likes}</span>
                          <span>💬 {post.engagement.comments}</span>
                          <span>🔄 {post.engagement.shares}</span>
                          <span>👁️ {post.engagement.impressions}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Scheduled Posts</h2>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Scheduled posts will appear here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Analytics</h2>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Detailed analytics will appear here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-6">Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Connected Accounts</h3>
                  <div className="space-y-2">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{platform.icon}</span>
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Current Plan</h3>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Free Plan</span>
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Upgrade
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">10 posts/month • 1 account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
