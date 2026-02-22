import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generatePostContent } from '@/services/ai';
import { logRequest, logError, logApiCall } from '@/lib/logger';

export async function POST(request: NextRequest) {
  logRequest(request);

  try {
    const { topic, platform, tone, includeHashtags = true } = await request.json();

    logApiCall('generate-post');

    // Generate content server-side (not exposing API key)
    const { content, hashtags } = await generatePostContent(
      topic,
      platform,
      tone,
      includeHashtags
    );

    return NextResponse.json({
      success: true,
      content,
      hashtags,
    });
  } catch (error: any) {
    logError(error as Error, 'generate-post-api');
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
