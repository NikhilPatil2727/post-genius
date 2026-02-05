import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

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

export async function generateContent(
  mode: 'topic' | 'rewrite',
  topic?: string,
  text?: string,
  tone?: string,
  audience?: string
) {
  try {
    const prompt = SYSTEM_PROMPT + '\n\n' + MAIN_PROMPT(mode, topic, text, tone, audience);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // More stable production model
      contents: prompt,
    });
    
    const content = response.text;
    
    if (!content) {
      throw new Error('No response from Gemini API');
    }
    
    // Clean and parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}