export async function queryClaude(
  input: string, 
  agentType: string, 
  contextString?: string,
  history?: { role: string; content: string }[]
) {
  // If no API key is provided, we can return a mock response for now
  // or use the server's Gemini API instead since it's the environment we are in.
  // The system uses Gemini by default. Let's use Gemini or a mock.
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      text: `[Saphira ${agentType.toUpperCase()} Agent] Processed query: "${input}". 
      (Note: API key not configured for full inference)`
    };
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    
    let systemPrompt = "You are a logical AI assistant.";
    
    if (agentType === "risk") systemPrompt = "You are a risk-assessment AI focusing on security and constraint checking.";
    if (agentType === "creative") systemPrompt = "You are a highly creative AI skilled at lateral thinking and ideation.";
    if (agentType === "execution") systemPrompt = "You are an execution-focused AI that breaks down workflows into precise steps.";
    if (agentType === "logic") systemPrompt = "You are a deeply analytical AI focusing on math, code, and quantitative reasoning.";

    systemPrompt += " Respond concisely and with authority. You are part of the Saphira ecosystem.";

    if (contextString) {
      systemPrompt += `\n\n${contextString}`;
    }

    let contents: any[] = [];
    if (history && history.length > 0) {
      contents = history.map(h => ({
        role: h.role, // 'user' or 'model'
        parts: [{ text: h.content }]
      }));
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: input }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt
      }
    });
    
    return { text: response.text };
  } catch (error) {
    console.error("AI Error:", error);
    return { text: "Error accessing intelligence core." };
  }
}
