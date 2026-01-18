import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const SYSTEM_PROMPT = `You are a professional social media content strategist.

Your job is to create high-quality, human-like content that feels natural,
clear, and platform-native.

Rules:
- Do NOT sound robotic.
- Avoid generic AI phrases.
- Keep language simple and confident.
- Optimize content based on platform limits and best practices.
- Output must be structured and easy to read.`;

const MAIN_PROMPT = (mode: string, topic?: string, text?: string, tone?: string, audience?: string) => `
MODE: ${mode}

${mode === 'topic' ? `
Topic: ${topic}
Tone: ${tone}
Audience: ${audience}

First, write a high-quality master post (600–900 words)
based on the topic, tone, and audience.
The content should provide value, insights, and a clear takeaway.
` : `
Here is the user's content:
${text}

First, improve and clean this content without changing its meaning.
Keep the user's natural voice.
`}

---

After creating the master content, generate platform-specific versions:

1) LinkedIn Post
- 1200–2000 characters
- Professional tone
- Short paragraphs
- End with 3 relevant hashtags

2) X (Twitter) Short Post
- Maximum 280 characters
- Strong hook
- Clear message

3) X (Twitter) Thread
- 3–5 tweets
- Each tweet under 280 characters
- Informative and engaging

4) Instagram Caption
- First 125 characters must be a strong hook
- Friendly and conversational
- Add 5 relevant hashtags at the end

5) Peerlist Post
- Maximum 200 characters
- Professional and concise

---

Output format (IMPORTANT):
Return the result in valid JSON like this:

{
  "masterContent": "...",
  "linkedin": "...",
  "twitterShort": "...",
  "twitterThread": ["...", "..."],
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