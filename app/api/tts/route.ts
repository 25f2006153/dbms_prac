export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text || !voiceId) {
      return new Response("Missing text or voiceId", { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return new Response("Missing ElevenLabs API Key", { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API Error:", errorText);
      return new Response(errorText, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "audio/mpeg"
      }
    });
  } catch (error) {
    console.error("TTS API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate TTS" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
