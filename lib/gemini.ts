import { GoogleGenAI } from "@google/genai";
import { ContentResponse } from "@/types";

const SYSTEM_PROMPT = `You are a professional social media content strategist.
Create natural, human-like content that fits each platform.

Rules:
- Sound natural, not robotic.
- No generic AI phrases.
- Simple, confident language.
- Platform-native formatting.
- Output MUST be structured JSON.`;

const MAIN_PROMPT = (mode: string, topic?: string, text?: string, tone?: string, audience?: string) => `
MODE: ${mode}

${mode === 'topic' ? `
Topic: ${topic}
Tone: ${tone}
Audience: ${audience}

Write a master post (600–900 words) that gives value, insight, and a clear takeaway.
` : `
User content:
${text}

Improve clarity without changing meaning. Keep the user's voice.
`}

After the master content, generate:

1) LinkedIn Post  
- 1200–2000 characters  
- Professional tone  
- Short paragraphs  
- End with 3 relevant hashtags  

2) X (Twitter) Short Post  
- Max 280 characters  
- Strong hook  
- Clear message  

3) Instagram Caption  
- Max 2200 characters  
- First 125 characters = strong hook  
- Friendly tone  
- End with 5 hashtags   

4) Peerlist Post  
- Max 2000 characters  
- Professional and concise  

Return JSON in this format:
{
  "masterContent": "...",
  "linkedin": "...",
  "twitterShort": "...",
  "instagram": "...",
  "peerlist": "..."
}
`;

/**
 * Generates AI content using the Gemini model.
 * Optimized for speed and reliability using JSON mode.
 */
export async function generateContent(
  mode: 'topic' | 'rewrite',
  apiKey: string,
  topic?: string,
  text?: string,
  tone?: string,
  audience?: string
): Promise<ContentResponse> {
  try {
    const ai = new GoogleGenAI({ apiKey });

    // Use gemini-2.0-flash for maximum speed and optimization
    const model = 'gemini-2.5-flash';
    const prompt = SYSTEM_PROMPT + '\n\n' + MAIN_PROMPT(mode, topic, text, tone, audience);
    
    // Generate content using the modern SDK pattern with JSON mode enabled
    const apiResponse = await ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7, // Balanced for creativity and structure
      }
    });
    
    if (!apiResponse || !apiResponse.candidates || apiResponse.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const candidate = apiResponse.candidates[0];
    const contentText = candidate.content?.parts?.[0]?.text;

    if (!contentText) {
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Content generation blocked by Gemini safety filters');
      }
      throw new Error(`Gemini API returned an empty response. Reason: ${candidate.finishReason || 'Unknown'}`);
    }

    console.log('Gemini Content Retrieved Successfully');
    
    // Parse the JSON response
    const parsed = JSON.parse(contentText);

    // Robust mapping for common variations in AI output keys
    return {
      masterContent: parsed.masterContent || parsed.master || "",
      linkedin: parsed.linkedin || "",
      twitterShort: parsed.twitterShort || parsed.twitterShortPost || parsed.twitter || "",
      instagram: parsed.instagram || parsed.instagramCaption || "",
      peerlist: parsed.peerlist || ""
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    // Improve error message for production troubleshooting
    if (error instanceof Error && error.message.includes('model not found')) {
      throw new Error('The selected Gemini model is not available. Please try again later or check your API key permissions.');
    }
    throw error;
  }
}
