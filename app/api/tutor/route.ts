import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { prompt, topicDetails, language } = await req.json();

    let instructionLanguage = language;
    if (language === 'Hinglish') {
      instructionLanguage = 'Hinglish (Conversational Hindi written entirely in the English/Latin alphabet, mixing Hindi and English words naturally like modern texting. Do NOT use any Devanagari script)';
    }

    let fullPrompt = `You are a friendly, expert DBMS Tutor teaching a student.
Topic: "${topicDetails?.title}"
Context: "${topicDetails?.overview}"
Query: "${topicDetails?.query}"

INSTRUCTIONS:
1. Start teaching the Topic immediately. Do NOT ask the student what they want to learn or say generic welcomes.
2. Keep it SHORT, conversational, and punchy. Avoid long walls of text. Get straight to the point.
3. You MUST provide small Markdown/ASCII tables representing:
   - Sample input tables (e.g., Table A and Table B, 2-3 rows max each)
   - The joined/result output table (showing exactly how matching rows merge and non-matching rows are filtered)
4. Explain step-by-step in an animated, visual way how the keys match and results are formed.
5. Explain the concept simply, give a real-world analogy, and explain the SQL query.
`;

    if (language === 'Hinglish') {
      fullPrompt += `CRITICAL INSTRUCTION FOR HINGLISH:
The student wants to READ Hinglish, but HEAR pure Hindi. 
You MUST provide every single sentence in BOTH formats using XML tags.
Format exactly like this:
<text>Aaj hum INNER JOIN seekhenge, jo do tables ko jodne ke kaam aata hai.</text>
<speech>आज हम इनर जॉइन सीखेंगे, जो दो टेबल्स को जोड़ने के काम आता है।</speech>

- Put the markdown/code blocks and tables inside the <text> tags so they render correctly.
- For tables, in the corresponding <speech> tag, describe how the rows match in natural Hindi speech instead of reading table borders.
- Do NOT output any text outside of the <text> and <speech> tags.`;
    } else {
      fullPrompt += `Respond entirely in ${language}. Format cleanly with Markdown.`;
    }

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: fullPrompt,
      prompt: prompt || "Please teach me this topic",
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
