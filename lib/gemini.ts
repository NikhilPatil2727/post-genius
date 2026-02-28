import { GoogleGenAI } from "@google/genai";
import { ContentResponse } from "@/types";

const SYSTEM_PROMPT = `You are a professional social media content strategist.
Create natural, human-like content that fits each platform.

Rules:
- Sound natural, not robotic.
- No generic AI phrases.
- Simple, confident language.
- Platform-native formatting.
- Output must be structured JSON only.
- Output must be structured and easy to read.`;

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

Return ONLY valid JSON:

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
 * 
 * @param mode - 'topic' to write from scratch, 'rewrite' to improve existing text
 * @param apiKey - User's Google Gemini API key
 * @param topic - Topic for post (for 'topic' mode)
 * @param text - Existing text (for 'rewrite' mode)
 * @param tone - Preferred tone of voice
 * @param audience - Target audience
 * @returns Parsed JSON with master and platform posts
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
    // Initialize Google AI with the provided API key using the original pattern
    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    const prompt = SYSTEM_PROMPT + '\n\n' + MAIN_PROMPT(mode, topic, text, tone, audience);
    
    // Generate content using the models.generateContent API
    const apiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using stable model for reliability
      contents: prompt,
    });
    
    // Extract content safely from the API response
    let content = "";
    if (typeof apiResponse.text === 'string') {
       content = apiResponse.text;
    } else if (typeof (apiResponse as any).text === 'function') {
       content = (apiResponse as any).text();
    } else {
       // Fallback to manual extraction if neither property nor helper exists
       content = (apiResponse as any).candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    
    if (!content) {
      console.error('Full Gemini API Response:', JSON.stringify(apiResponse, null, 2));
      throw new Error('No response text retrieved from Gemini API');
    }

    console.log('Gemini Raw Content:', content);
    
    // Clean and parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    const parsed = JSON.parse(jsonMatch[0]);

    // Robust mapping for common variations in AI output keys
    const finalContent = {
      masterContent: parsed.masterContent || parsed.master || "",
      linkedin: parsed.linkedin || "",
      twitterShort: parsed.twitterShort || parsed.twitter || "",
      instagram: parsed.instagram || "",
      peerlist: parsed.peerlist || ""
    };

    return finalContent;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}