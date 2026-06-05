import { Modality } from "@google/genai";
import { getAccessToken } from "../lib/firebase";

export async function sendMessage(
  message: string,
  history: { role: "user" | "model"; parts: { text?: string; inlineData?: any }[] }[] = [],
  attachmentParts?: { inlineData: { data: string; mimeType: string } }[],
  onChunk?: (text: string) => void,
  systemPrompt: string = "You are Saphira, a highly sophisticated, elegant, and intelligent multimodal assistant. You are concise, helpful, and speak with a calm, precise tone.",
  modelOverride?: string,
  configOverride?: any,
  verificationMode?: "realtime" | "strict"
) {
  try {
    const token = await getAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`; // Use Bearer token for authMiddleware or fallback gracefully if not configured
    }

    const payload = {
      message,
      history,
      attachmentParts,
      systemPrompt,
      modelOverride,
      configOverride,
      verificationMode
    };

    let controller = new AbortController();
    
    // Implement standard network interceptor / retry logic
    let res: Response | null = null;
    for (let attempts = 0; attempts < 3; attempts++) {
      try {
        res = await fetch("/api/ai/gemini-stream", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        if (res.ok) break;
        if (res.status === 429) throw new Error("429");
      } catch (e: any) {
        if (attempts === 2) throw e;
        await new Promise(r => setTimeout(r, 1000 * (attempts + 1))); // exponential backoff
      }
    }

    if (!res || !res.ok) {
      const statusCode = res?.status;
      let errorData: any = {};
      try {
        const errorText = res ? await res.text() : "";
        errorData = errorText ? JSON.parse(errorText) : {};
      } catch (e) {}
      
      let errorMessage = `Unexpected server response (Status: ${statusCode}).`;
      
      if (statusCode === 429) {
        throw new Error("I'm currently receiving too many requests. My cognitive architecture is slightly over capacity—please give me a moment to recalibrate and try your request again.");
      } else if (statusCode === 401 || statusCode === 403) {
        throw new Error("My security protocols have denied access. Please ensure you are authenticated.");
      } else if (statusCode && statusCode >= 500) {
         return { text: "Interface decoupled from backend loops. System stabilizing." };
      } else if (!res) {
         return { text: "Interface decoupled from backend loops. System stabilizing." };
      } else {
         throw new Error(errorData.error || errorMessage);
      }
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response stream");
    
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.replace("data: ", "").trim();
          if (dataStr === "{}") continue; // end stream message 
          try {
            const data = JSON.parse(dataStr);
            if (data.error) throw new Error(data.error);
            if (data.text) {
              fullText += data.text;
              onChunk?.(data.text);
            }
          } catch (e) {
            // Unparseable or incomplete chunk chunk
          }
        }
      }
    }
    
    // Currently images are omitted in the server-side streaming proxy for simplicity
    return { text: fullText };
  } catch (error: any) {
    console.error("Gemini Proxy Stream Error:", error);
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return { text: "I'm currently receiving too many requests. My cognitive architecture is slightly over capacity—please give me a moment to recalibrate and try your request again." };
    }
    return { text: "Interface decoupled from backend loops. System stabilizing." };
  }
}

export async function generateSpeech(
  text: string, 
  urgency: 'low' | 'normal' | 'high' = 'normal',
  voiceProfile: string = 'samantha',
  softness: number = 0.8
): Promise<string | null> {
  try {
    const token = await getAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    const res = await fetch("/api/ai/gemini-tts", {
      method: "POST",
      headers,
      body: JSON.stringify({ text, urgency, voiceProfile, softness })
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.audioBase64 || null;
    }
    return null;
  } catch (e) {
    console.error("TTS backend error:", e);
    return null;
  }
}

export async function generateSpeechStream(text: string, voiceName: string = 'Aoede'): Promise<any> {
  throw new Error("generateSpeechStream not implemented over HTTP proxy yet.");
}


