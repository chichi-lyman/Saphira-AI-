export const generateSamanthaVoice = async (text: string): Promise<Blob | null> => {
  const env = (import.meta as any).env;
  let apiKey = env.VITE_ELEVENLABS_API_KEY;
  let voiceId = env.VITE_ELEVENLABS_VOICE_ID;
  
  if (env.VITE_ELEVENLABS_VOICE_ID?.startsWith('sk_')) {
    if (!apiKey) apiKey = env.VITE_ELEVENLABS_VOICE_ID;
  }
  
  if (!voiceId || voiceId.length !== 20 || voiceId.startsWith('sk_')) {
    voiceId = 'EXAVITQu4vr4xnSDxMaL';
  }
  
  if (!apiKey) {
    console.warn("ElevenLabs API Key not found. Falling back to Gemini/browser TTS.");
    return null;
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  
  const headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": apiKey
  };
  
  const data = {
    text: text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.40,
      similarity_boost: 0.85,
      style: 0.55,
      use_speaker_boost: true
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return await response.blob();
    } else {
      const errText = await response.text();
      console.error(`ElevenLabs API Error: ${errText}`);
      return null;
    }
  } catch (error) {
    console.error("ElevenLabs Request Error:", error);
    return null;
  }
};
