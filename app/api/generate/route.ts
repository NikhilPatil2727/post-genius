import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { mode, topic, text, tone, audience } = body;
    
    if (!mode || (mode === 'topic' && !topic) || (mode === 'rewrite' && !text)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const content = await generateContent(mode, topic, text, tone, audience);
    
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}