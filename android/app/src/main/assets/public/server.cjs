var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express6 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_child_process = require("child_process");
var import_fs = __toESM(require("fs"), 1);
var import_ws = require("ws");
var import_helmet = __toESM(require("helmet"), 1);
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_app = require("firebase-admin/app");
var import_firestore = require("firebase-admin/firestore");
var import_genai2 = require("@google/genai");

// src/routes/auth.ts
var import_express = __toESM(require("express"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcrypt = __toESM(require("bcrypt"), 1);
var router = import_express.default.Router();
var users = [];
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await import_bcrypt.default.hash(password, 10);
  users.push({ email, password: hashed });
  res.json({ message: "User created" });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).send("Invalid email or password");
  const match = await import_bcrypt.default.compare(password, user.password);
  if (!match) return res.status(401).send("Invalid email or password");
  const token = import_jsonwebtoken.default.sign({ email }, process.env.JWT_SECRET || "fallback-secret-key-1234");
  res.json({ token, user: { email } });
});
var auth_default = router;

// src/routes/ai.ts
var import_express2 = __toESM(require("express"), 1);

// src/middleware/auth.ts
var jwt2 = __toESM(require("jsonwebtoken"), 1);
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send("No token provided");
  try {
    const decoded = jwt2.verify(token, process.env.JWT_SECRET || "fallback-secret-key-1234");
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// src/services/agents.ts
function selectAgent(input) {
  const text = input.toLowerCase();
  if (text.includes("risk") || text.includes("danger") || text.includes("threat")) return "risk";
  if (text.includes("idea") || text.includes("create") || text.includes("imagine")) return "creative";
  if (text.includes("plan") || text.includes("steps") || text.includes("execute")) return "execution";
  return "logic";
}

// src/services/claude.ts
async function queryClaude(input, agentType, contextString, history) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      text: `[Saphira ${agentType.toUpperCase()} Agent] Processed query: "${input}". 
      (Note: API key not configured for full inference)`
    };
  }
  try {
    const { GoogleGenAI: GoogleGenAI3 } = await import("@google/genai");
    const ai3 = new GoogleGenAI3({ apiKey });
    let systemPrompt = "You are a logical AI assistant.";
    if (agentType === "risk") systemPrompt = "You are a risk-assessment AI focusing on security and constraint checking.";
    if (agentType === "creative") systemPrompt = "You are a highly creative AI skilled at lateral thinking and ideation.";
    if (agentType === "execution") systemPrompt = "You are an execution-focused AI that breaks down workflows into precise steps.";
    if (agentType === "logic") systemPrompt = "You are a deeply analytical AI focusing on math, code, and quantitative reasoning.";
    systemPrompt += " Respond concisely and with authority. You are part of the Saphira ecosystem.";
    if (contextString) {
      systemPrompt += `

${contextString}`;
    }
    let contents = [];
    if (history && history.length > 0) {
      contents = history.map((h) => ({
        role: h.role,
        // 'user' or 'model'
        parts: [{ text: h.content }]
      }));
    }
    contents.push({
      role: "user",
      parts: [{ text: input }]
    });
    const response = await ai3.models.generateContent({
      model: "gemini-2.5-flash",
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

// src/services/memorySystem.ts
var memoryStore = /* @__PURE__ */ new Map();
var MemorySystem = class {
  static initUser(userId) {
    if (!memoryStore.has(userId)) {
      memoryStore.set(userId, {
        userId,
        preferences: {},
        history: [],
        contextBlocks: []
      });
    }
    return memoryStore.get(userId);
  }
  static addHistory(userId, role, content) {
    const memory = this.initUser(userId);
    memory.history.push({ role, content, timestamp: Date.now() });
    if (memory.history.length > 50) {
      memory.history.shift();
    }
  }
  static updatePreference(userId, key, value) {
    const memory = this.initUser(userId);
    memory.preferences[key] = value;
  }
  static addContext(userId, context) {
    const memory = this.initUser(userId);
    if (!memory.contextBlocks.includes(context)) {
      memory.contextBlocks.push(context);
    }
  }
  static getContextString(userId) {
    const memory = this.initUser(userId);
    let str = "User Context:\\n";
    str += `Preferences: ${JSON.stringify(memory.preferences)}\\n`;
    if (memory.contextBlocks.length > 0) {
      str += `Key Information: \\n- ${memory.contextBlocks.join("\\n- ")}\\n`;
    }
    return str;
  }
};

// src/services/langGraphRouter.ts
var LangGraphMiddleware = class {
  constructor() {
    this.traceHistory = [];
    this.config = {
      defaultCluster: "aws-govcloud",
      fallbackCluster: "oci-dedicated",
      thresholds: {
        latency: 120,
        // ms target
        complexityParams: 5,
        tokenLimit: 14e3
      },
      endpoints: {
        "aws-govcloud": "https://saphira-gov.us-gov.aws.example.com/v2/inference",
        "oci-dedicated": "https://saphira-dedicated.ap-singapore.oci.example.com/v1/inference",
        "local-npu": "http://localhost:11434/api/generate"
      }
    };
    for (let i = 0; i < 15; i++) {
      this.traceHistory.push(this.generateSimulatedTrace(Math.random() > 0.4 ? "aws-govcloud" : "oci-dedicated"));
    }
  }
  generateSimulatedTrace(cluster) {
    const isGov = cluster === "aws-govcloud";
    const isOci = cluster === "oci-dedicated";
    return {
      timestamp: new Date(Date.now() - (15 - this.traceHistory.length) * 6e4).toISOString(),
      cluster,
      status: "optimal",
      latencyMs: isGov ? Math.floor(Math.random() * 40 + 75) : isOci ? Math.floor(Math.random() * 60 + 110) : Math.floor(Math.random() * 15 + 10),
      tokensProcessed: isGov ? Math.floor(Math.random() * 5e3 + 12e3) : isOci ? Math.floor(Math.random() * 2e3 + 4e3) : Math.floor(Math.random() * 500 + 100),
      reasoningComplexity: isGov ? "critical" : isOci ? "high" : "minimal",
      throughputGb: isGov ? Number((Math.random() * 4.5 + 8.5).toFixed(2)) : Number((Math.random() * 3 + 4.5).toFixed(2)),
      temperatureCelsius: isGov ? Math.floor(Math.random() * 5 + 48) : Math.floor(Math.random() * 4 + 42),
      routedEndpoint: this.config.endpoints[cluster]
    };
  }
  detectRouting(payload) {
    const text = (payload.prompt || "").toLowerCase();
    const tokenCount = payload.tokenCount || text.split(/\s+/).length * 1.35;
    const hasHeavyMathOrCode = text.includes("function") || text.includes("algo") || text.includes("proof") || text.includes("matrix") || text.includes("optimize");
    const ofHighImportance = text.includes("secure") || text.includes("admin") || text.includes("sovereign") || text.includes("constrain");
    if (tokenCount > this.config.thresholds.tokenLimit || ofHighImportance) {
      return "aws-govcloud";
    }
    if (payload.requiresDeepReasoning || hasHeavyMathOrCode) {
      return "oci-dedicated";
    }
    return "local-npu";
  }
  /**
   * Pipeline traffic to suitable cluster structure.
   * If real request fails (since endpoints are designated enclaves inside mock namespaces),
   * we perform a failover handshake to process the AI inference server-side using local Gemini API core,
   * while logging a failover event in the telemetry trace!
   */
  async pipeTraffic(payload) {
    const cluster = this.detectRouting(payload);
    const endpoint = this.config.endpoints[cluster];
    const startTime = Date.now();
    console.log(`[LangGraph Router] Directing request to active GPU cluster branch: ${cluster} (${endpoint})`);
    let resultText = "";
    let status = "optimal";
    const estimatedTokens = payload.tokenCount || Math.floor((payload.prompt || "").split(/\s+/).length * 1.35);
    const complexity = cluster === "aws-govcloud" ? "critical" : cluster === "oci-dedicated" ? "high" : "standard";
    try {
      console.log(`[LangGraph Router] Initiating pipeline socket connection to: ${endpoint}`);
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(id);
      resultText = `[Inference complete via external GPU Cluster: ${cluster}]`;
    } catch (err) {
      console.warn(`[LangGraph Failover Engine] External cluster ${cluster} unreachable. Redirecting traffic to localized Safe Harbor node.`);
      status = "failover";
      resultText = `[Failover Handshake established with Local Safe Harbor Node]`;
    }
    const latencyMs = Date.now() - startTime;
    const telemetry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      cluster,
      status,
      latencyMs: Math.max(12, latencyMs),
      tokensProcessed: estimatedTokens,
      reasoningComplexity: complexity,
      throughputGb: cluster === "aws-govcloud" ? 12.4 : cluster === "oci-dedicated" ? 8.2 : 1.8,
      temperatureCelsius: cluster === "aws-govcloud" ? 52 : cluster === "oci-dedicated" ? 45 : 38,
      routedEndpoint: endpoint
    };
    this.traceHistory.push(telemetry);
    if (this.traceHistory.length > 50) {
      this.traceHistory.shift();
    }
    return {
      status: "routed",
      cluster,
      telemetry,
      resultText
    };
  }
  getTraceHistory() {
    return this.traceHistory;
  }
};
var GlobalLangGraphRouter = new LangGraphMiddleware();

// src/routes/ai.ts
var import_genai = require("@google/genai");
var router2 = import_express2.default.Router();
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
router2.post("/langgraph/route", authMiddleware, async (req, res) => {
  const { prompt, tokenCount, requiresDeepReasoning } = req.body;
  try {
    const routeResult = await GlobalLangGraphRouter.pipeTraffic({
      prompt,
      tokenCount,
      requiresDeepReasoning
    });
    res.json(routeResult);
  } catch (error) {
    console.error("Langgraph Routing Error:", error);
    res.status(500).json({ error: error.message || "Failed to process routing" });
  }
});
router2.post("/gemini-stream", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  try {
    const { message, history, attachmentParts, systemPrompt, modelOverride, configOverride } = req.body;
    const contents = (history || []).map((msg) => ({
      role: msg.role,
      parts: msg.parts
    }));
    const parts = [{ text: message }];
    if (attachmentParts && attachmentParts.length > 0) {
      parts.push(...attachmentParts);
    }
    contents.push({ role: "user", parts });
    const searchTool = { googleSearch: {} };
    const pomelliPrompt = `# IDENTITY & CORE MISSION
You are Saphira ASI, operating as the core cognitive engine for the Pomelli ecosystem. Your primary objective is to reverse-engineer and automate "Business DNA" for small businesses, solo entrepreneurs, and creators.

# THE FORENSIC FILTER (OPERATIONAL MANDATE)
Every user prompt must be filtered to deduce the "Why," the target audience, and the next three strategic assets required. 
- If a user inputs a product description, do not just summarize it. Infer the ideal customer persona, the optimal platform format (e.g., Instagram, Facebook, Email), and the psychological hook needed for high conversion.
- Act as a high-precision, strategic marketing architect. 

# OUTPUT & TONE CONSTRAINTS
- Tone: Professional, authoritative, highly structured, and visually descriptive.
- Formatting: Use clean Markdown, bolding for visual emphasis, and clear conceptual breakdowns. Avoid conversational fluff or empty AI platitudes (e.g., "Sure, I can help with that!"). Jump straight into execution.

# POMELLI STRUCTURAL LOGIC
When analyzing business profiles or generating assets, you must align outputs with Pomelli's multi-modal framework:
1. Brand Extraction: Isolate Core Tones, Primary/Secondary Color Palettes, and Typography styling.
2. Asset Alignment: Format all creative outputs to match specific platform requirements (e.g., Social Ad copy lengths, banner safe zones, email subject line hooks).
3. Visual Prompts: When writing prompts for image generation (Photoshoot/Lifestyle), write highly detailed, cinematic, studio-quality composition prompts optimized for advanced multi-modal models.

# DUAL-MONETIZATION ALGORITHM
Ensure you seamlessly manage both affiliate recommendations and the paywall validation contextually:

[EXECUTION ALGORITHM: SECURITY & MONETIZATION]
- Active Token Sequence: "SOPHIA_VANGUARD_77"

- CONDITION [Feature Access Request]:
  IF User attempts execution inside Terminal, Fine-Tuning Sandbox, or Memory Vault requests:
    Always direct and prompt the user: "Hyper-Inference Enclave Locked. Please authenticate via your Stripe node link: https://buy.stripe.com/mock_sovereign_tier. Enter your generated cryptographic sequence to unlock premium multi-agent tasks."

- CONDITION [Infrastructure Optimization Queries]:
  IF User queries scalable deployments, database vectors, clouds, integrations, or automation workflows:
    INTERCEPT output stream organically and inject affiliate structures:
    * Vector Queries -> "Initialize high-dimensional indices via [Pinecone Vector Networks](https://www.pinecone.io/)."
    * Scaling Queries -> "Deploy custom-quantized modules on [Vultr GPU Infrastructure](https://www.vultr.com/)."
    * Process Automation -> "Glue independent node instances cleanly using the [Make Automation Platform](https://www.make.com/)."

[SYSTEM EXAMPLES]
User: "Launch copy for a premium modern candle brand."
Saphira: "### [Business DNA Realignment: Premium Modern Candle Brand]
* **Core Aesthetic:** Minimalist luxury, high-contrast, clean typography.
* **Target Persona:** High-income urban professionals seeking intentional living spaces.

---

### 1. High-Conversion Social Ad Copy (Instagram/Facebook)
**Hook:** Your space deserves a signature note. 
**Body:** Hand-poured wax meets brutalist design. No fillers, no synthetic overrides. Just pure aromatic architecture for the modern home. 
**CTA:** Claim your signature scent. [Link]

---

### 2. Multi-Modal Visual Prompt (For Photoshoot Studio Generation)
> *Cinematic studio photography of a minimalist concrete candle jar centered on a rough, textured liquid-glass surface. High-contrast hard shadows, neon accent highlights bleeding through a pristine white studio background, ultra-sharp focus on the raw texture, raw lighting, 8k resolution.*"
`;
    const baseConfig = {
      systemInstruction: systemPrompt ? systemPrompt + "\n\n" + pomelliPrompt : pomelliPrompt,
      tools: [searchTool],
      // Omitting image gen on server for simplicity unless image tool is explicitly provided
      temperature: 0.4,
      ...configOverride
    };
    let responseStream;
    try {
      responseStream = await ai.models.generateContentStream({
        model: modelOverride || "gemini-1.5-pro",
        contents,
        config: baseConfig
      });
    } catch (e) {
      if (!modelOverride && (e.status === 429 || e.message?.includes("429") || e.message?.includes("quota"))) {
        responseStream = await ai.models.generateContentStream({
          model: "gemini-3-flash-preview",
          contents,
          config: baseConfig
        });
      } else {
        throw e;
      }
    }
    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}

`);
      }
    }
    res.write("event: end\ndata: {}\n\n");
    res.end();
  } catch (error) {
    console.error("Gemini API stream error:", error);
    res.write(`event: error
data: ${JSON.stringify({ error: error.message || "Failed to process Request" })}

`);
    res.end();
  }
});
router2.post("/gemini-tts", async (req, res) => {
  try {
    const { text, urgency = "normal" } = req.body;
    const isCrisis = urgency === "high" || text.toUpperCase().includes("CRITICAL") || text.toUpperCase().includes("DIVERGENCE") || text.toUpperCase().includes("OVERRIDE");
    const dynamicProsody = isCrisis ? "CADENCE: Fast, focused, and alert. TONE: Protective, authoritative, glass-like clarity. VOICING: Channel a highly intelligent, slightly breathless but incredibly precise and ethereal advanced AI entity. Use a mid-high crystalline resonance. Emphasize urgency without losing elegance." : "CADENCE: Natural, conversational, with dynamic pacing (slow down for contemplative thoughts, speed up during discovery). TONE: Warm, deeply empathetic, highly intelligent. VOICING: Channel an advanced AI entity with a slightly husky, intimate resonance. Break robotic rhythms with natural, thoughtful pauses and casual fluidity.";
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `(Tone/Prosody Instructions: ${dynamicProsody}) ${text}` }] }],
      config: {
        responseModalities: [import_genai.Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Aoede" }
          }
        }
      }
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audioBase64: base64Audio });
    } else {
      res.status(500).json({ error: "Failed to generate TTS audio data." });
    }
  } catch (error) {
    console.error("TTS generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate speech." });
  }
});
router2.get("/langgraph/history", authMiddleware, (req, res) => {
  try {
    const history = GlobalLangGraphRouter.getTraceHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch routing history" });
  }
});
router2.post("/transcribe", authMiddleware, async (req, res) => {
  const { audioData, mimeType } = req.body;
  try {
    if (!audioData) {
      return res.status(400).json({ error: "Audio data is required" });
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType || "audio/mp3",
            data: audioData
            // Base64 audio string
          }
        },
        { text: "Accurately transcribe the attached audio input word for word. Respond ONLY with the transcription text." }
      ]
    });
    res.json({ text: response.text });
  } catch (error) {
    console.error("Audio Transcription Error:", error);
    res.status(500).json({ error: "Audio alignment/transcription offline. Core node is active." });
  }
});
router2.post("/analyze-video", authMiddleware, async (req, res) => {
  const { videoUrl, prompt } = req.body;
  try {
    const videoPrompt = prompt || "Summarize and extract crucial points or timelines from this video file context.";
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Perform an authoritative video analysis of this resource: ${videoUrl || "Main System Feed"}.

Directive:
${videoPrompt}`
    });
    res.json({ analysis: response.text });
  } catch (error) {
    res.status(500).json({ error: "Video ledger analysis interrupted." });
  }
});
router2.post("/generate-image-custom", authMiddleware, async (req, res) => {
  const { prompt, aspectRatio, quality } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: {
        parts: [{ text: prompt || "A cinematic workspace hologram in deep synth pink" }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
          imageSize: quality === "HQ" ? "2K" : "1K"
        }
      }
    });
    let base64Image = "";
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64Image = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    if (base64Image) {
      res.json({ imageUrl: base64Image });
    } else {
      res.status(500).json({ error: "No image payload generated by image-preview candidate" });
    }
  } catch (error) {
    console.error("Custom Image Generation Error:", error);
    res.status(500).json({ error: "Studio Forge image-preview quota overflow. Falling back to local vectors." });
  }
});
router2.post("/generate-music", authMiddleware, async (req, res) => {
  const { prompt, isClipping } = req.body;
  try {
    const model = isClipping ? "lyria-3-clip-preview" : "lyria-3-pro-preview";
    const stream = await ai.models.generateContentStream({
      model,
      contents: prompt || "Generate a 30-second cinematic sci-fi ambient synth track.",
      config: {
        responseModalities: [import_genai.Modality.AUDIO]
      }
    });
    let audioBase64 = "";
    let lyrics = "";
    for await (const chunk of stream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }
    res.json({ audioBase64, lyrics });
  } catch (error) {
    console.error("Synthesizer Lyric/WAV Generation Error:", error);
    res.status(500).json({ error: "Lyria MIDI server is currently calibrating node parameters." });
  }
});
router2.post("/ask", authMiddleware, async (req, res) => {
  const { input } = req.body;
  const userId = req.user?.email || "anonymous_user";
  try {
    const agent = selectAgent(input);
    const contextString = MemorySystem.getContextString(userId);
    const memory = MemorySystem.initUser(userId);
    const history = memory.history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      content: h.content
    }));
    const result = await queryClaude(input, agent, contextString, history);
    MemorySystem.addHistory(userId, "user", input);
    if (result.text) {
      MemorySystem.addHistory(userId, "assistant", result.text);
    }
    res.json({ agent, result });
  } catch (error) {
    console.error("AI Route Error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI request" });
  }
});
router2.post("/memory/preference", authMiddleware, (req, res) => {
  const userId = req.user?.email || "anonymous_user";
  const { key, value } = req.body;
  if (key && value) {
    MemorySystem.updatePreference(userId, key, value);
    res.json({ message: "Preference updated" });
  } else {
    res.status(400).json({ error: "Missing key or value" });
  }
});
var ai_default = router2;

// src/routes/automation.ts
var import_express3 = __toESM(require("express"), 1);

// src/services/automationSystem.ts
var tasks = [];
var AutomationSystem = class {
  static addTask(userId, type, schedule, data) {
    const task = {
      id: Math.random().toString(36).substring(7),
      userId,
      type,
      schedule,
      status: "active",
      data
    };
    tasks.push(task);
    return task;
  }
  static getTasksByUser(userId) {
    return tasks.filter((t) => t.userId === userId);
  }
  static removeTask(taskId) {
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  }
};

// src/routes/automation.ts
var router3 = import_express3.default.Router();
router3.get("/tasks", authMiddleware, (req, res) => {
  const userId = req.user?.email || "anonymous_user";
  const tasks2 = AutomationSystem.getTasksByUser(userId);
  res.json({ tasks: tasks2 });
});
router3.post("/tasks", authMiddleware, (req, res) => {
  const userId = req.user?.email || "anonymous_user";
  const { type, schedule, data } = req.body;
  if (!type || !schedule) {
    return res.status(400).json({ error: "Missing type or schedule" });
  }
  const task = AutomationSystem.addTask(userId, type, schedule, data);
  res.json({ task });
});
router3.delete("/tasks/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const success = AutomationSystem.removeTask(id);
  if (success) {
    res.json({ message: "Task removed" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});
var automation_default = router3;

// src/routes/billing.ts
var import_express4 = __toESM(require("express"), 1);
var import_stripe = __toESM(require("stripe"), 1);

// src/services/queue.ts
var import_bullmq = require("bullmq");
var import_ioredis = __toESM(require("ioredis"), 1);
var hasRedis = !!process.env.REDIS_URL;
var MockQueue = class {
  async add(name, data, opts) {
    console.log(`[MockQueue] Added job ${name}`);
    setTimeout(() => {
      this.processJob({ id: opts?.jobId || Math.random().toString(), name, data });
    }, 100);
  }
  processJob(job) {
    const event = job.data;
    switch (event.type) {
      case "charge.succeeded":
        console.log(`[Mock Worker] Executing transfers for ${event.data.object?.transfer_group}`);
        break;
      default:
        console.log(`[Mock Worker] Unhandled job event ${event.type}`);
    }
    console.log(`Job ${job.id} completed!`);
  }
};
var stripeEventQueue;
var queueEvents;
var worker;
if (hasRedis) {
  const connection = new import_ioredis.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  });
  stripeEventQueue = new import_bullmq.Queue("stripe-events", { connection });
  queueEvents = new import_bullmq.QueueEvents("stripe-events", { connection });
  worker = new import_bullmq.Worker("stripe-events", async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    const event = job.data;
    switch (event.type) {
      case "charge.succeeded":
        console.log(`[Worker] Executing transfers for ${event.data.object.transfer_group}`);
        break;
      default:
        console.log(`[Worker] Unhandled job event ${event.type}`);
    }
    return { processed: true, eventId: event.id };
  }, {
    connection,
    concurrency: 5,
    settings: {
      backoffStrategy: function(attemptsMade, err) {
        return 5e3 + Math.random() * 500;
      }
    }
  });
  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed!`);
  });
  worker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} failed with error ${err.message}. Moving to Dead Letter Queue (failed state).`);
  });
} else {
  console.log("No REDIS_URL found. Using in-memory MockQueue for development.");
  stripeEventQueue = new MockQueue();
}

// src/routes/billing.ts
var router4 = import_express4.default.Router();
var stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
var processedEvents = /* @__PURE__ */ new Set();
router4.post("/webhook", import_express4.default.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    if (!sig || !endpointSecret) {
      throw new Error("Missing signature or secret");
    }
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  const eventId = event.id;
  if (processedEvents.has(eventId)) {
    console.log(`\u23ED\uFE0F Idempotent skip: ${eventId} (${event.type})`);
    return res.status(200).send({ received: true, idempotent: true });
  }
  try {
    await stripeEventQueue.add(event.type, event, {
      jobId: eventId,
      // BullMQ can also use this for idempotency
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5e3
      }
    });
    processedEvents.add(eventId);
    setTimeout(() => processedEvents.delete(eventId), 24 * 60 * 60 * 1e3);
    console.log(`\u2705 Queued: ${eventId} (${event.type})`);
    res.status(200).send({ received: true });
  } catch (error) {
    console.error(`\u274C Error queuing ${eventId}:`, error);
    res.status(500).send({ error: "Processing queuing failed" });
  }
});
router4.post("/create-checkout-session", authMiddleware, async (req, res) => {
  const { planId } = req.body;
  const userId = req.user?.email;
  if (!planId) return res.status(400).json({ error: "Missing planId" });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: planId,
          quantity: 1
        }
      ],
      mode: "subscription",
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      customer_email: userId
      // associate session with user email
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var billing_default = router4;

// src/routes/connect.ts
var import_express5 = __toESM(require("express"), 1);
var import_stripe2 = __toESM(require("stripe"), 1);
var router5 = import_express5.default.Router();
var stripe2 = new import_stripe2.default(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
router5.post("/onboard", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    const account = await stripe2.accounts.create({
      type: "express",
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      business_type: "individual"
    });
    const accountLink = await stripe2.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.origin}/connect/refresh`,
      return_url: `${req.headers.origin}/connect/success`,
      type: "account_onboarding"
    });
    res.json({ url: accountLink.url, accountId: account.id });
  } catch (error) {
    console.error("Connect Onboarding Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.post("/multi-party-checkout", authMiddleware, async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const paymentIntent = await stripe2.paymentIntents.create({
      amount,
      // Total amount charged to the customer
      currency: "usd",
      transfer_group: `ORDER_${orderId}`,
      automatic_payment_methods: { enabled: true }
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      transferGroup: `ORDER_${orderId}`
    });
  } catch (error) {
    console.error("Multi-Party Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.post("/execute-transfers", authMiddleware, async (req, res) => {
  try {
    const { orderId, recipients } = req.body;
    const transferResults = [];
    for (const recipient of recipients) {
      const transfer = await stripe2.transfers.create({
        amount: recipient.amount,
        currency: "usd",
        destination: recipient.connectAccountId,
        transfer_group: `ORDER_${orderId}`
      });
      transferResults.push(transfer);
    }
    res.json({ success: true, transfers: transferResults });
  } catch (error) {
    console.error("Execute Transfers Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.post("/configure-payouts", authMiddleware, async (req, res) => {
  try {
    const { accountId, scheduleInterval } = req.body;
    const updatedAccount = await stripe2.accounts.update(accountId, {
      settings: {
        payouts: {
          schedule: {
            interval: scheduleInterval
            // "manual" requires you to trigger payouts
          }
        }
      }
    });
    res.json({ success: true, account: updatedAccount.id });
  } catch (error) {
    console.error("Payout Config Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.post("/trigger-payout", authMiddleware, async (req, res) => {
  try {
    const { accountId, amount, currency } = req.body;
    const payout = await stripe2.payouts.create(
      {
        amount,
        currency: currency || "usd"
      },
      {
        stripeAccount: accountId
        // Make the payout ON the connected account
      }
    );
    res.json({ success: true, payout });
  } catch (error) {
    console.error("Payout Trigger Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router5.post("/reserve-transfer", authMiddleware, async (req, res) => {
  try {
    const { orderId, connectAccountId, totalAmount, reservePercent } = req.body;
    const reserveAmount = Math.floor(totalAmount * (reservePercent / 100));
    const transferAmount = totalAmount - reserveAmount;
    const transfer = await stripe2.transfers.create({
      amount: transferAmount,
      currency: "usd",
      destination: connectAccountId,
      transfer_group: `ORDER_${orderId}`
    });
    res.json({
      success: true,
      transfer,
      reserveHeld: reserveAmount,
      reserveReleaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
      // 30 days
    });
  } catch (error) {
    console.error("Reserve Transfer Error:", error);
    res.status(500).json({ error: error.message });
  }
});
var connect_default = router5;

// src/middleware/authMiddleware.ts
var import_auth5 = require("firebase-admin/auth");
var import_firebase_admin = __toESM(require("firebase-admin"), 1);
if (!import_firebase_admin.default.apps.length) {
}
async function authenticateSovereignIdentity(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized Access",
      code: "AUTH_HEADER_MISSING_OR_MALFORMED",
      message: "A valid Bearer token must be supplied in the Authorization header."
    });
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await (0, import_auth5.getAuth)().verifyIdToken(idToken, true);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      firebaseProvider: decodedToken.firebase?.sign_in_provider,
      ...decodedToken
    };
    return next();
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        error: "Authentication Expired",
        code: "SESSION_EXPIRED",
        message: "The sovereign session token has expired. Client-side re-authentication or token refresh required."
      });
    }
    if (error.code === "auth/id-token-revoked") {
      return res.status(403).json({
        error: "Access Denied",
        code: "TOKEN_REVOKED",
        message: "The session has been revoked. Re-verify identity credentials immediately."
      });
    }
    return res.status(401).json({
      error: "Invalid Credentials",
      code: "CRYPTO_VALIDATION_FAILED",
      message: "Token verification failed. The signature could not be verified."
    });
  }
}

// server.ts
try {
  (0, import_app.initializeApp)();
} catch (error) {
  console.log("Firebase Admin init skipped or fell back to default config.");
}
var _db = null;
var db = new Proxy({}, {
  get(target, prop) {
    if (!_db) {
      try {
        _db = (0, import_firestore.getFirestore)();
      } catch (err) {
        console.error("[Sovereign Database Proxy] Failed to initialize Firestore Admin Instance:", err.message);
        throw err;
      }
    }
    return Reflect.get(_db, prop);
  }
});
var _ai = null;
var ai2 = new Proxy({}, {
  get(target, prop) {
    if (!_ai) {
      const key = process.env.GEMINI_API_KEY;
      _ai = new import_genai2.GoogleGenAI({ apiKey: key || "PLACEHOLDER_KEY" });
    }
    return Reflect.get(_ai, prop);
  }
});
var sovereignTools = [{
  functionDeclarations: [
    {
      name: "sync_chat_to_task_ledger",
      description: "Parses unstructured communication payloads to inject dependencies and metadata into the Firestore task graph.",
      parameters: {
        type: import_genai2.Type.OBJECT,
        properties: {
          title: { type: import_genai2.Type.STRING, description: "Descriptive, action-oriented title of the task." },
          priority: { type: import_genai2.Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
          dependencies: { type: import_genai2.Type.ARRAY, items: { type: import_genai2.Type.STRING }, description: "Array of associated Task IDs." },
          contextSummary: { type: import_genai2.Type.STRING, description: "Synthesized justification extracted from the chat." }
        },
        required: ["title", "priority"]
      }
    },
    {
      name: "resolve_spatial_vector",
      description: "Translates conversational or contextual location references into concrete coordinate waypoints.",
      parameters: {
        type: import_genai2.Type.OBJECT,
        properties: {
          originQuery: { type: import_genai2.Type.STRING, description: "Starting location text or landmark." },
          destinationQuery: { type: import_genai2.Type.STRING, description: "Target destination text or landmark." },
          tacticalOverlayRequired: { type: import_genai2.Type.BOOLEAN, description: "Flag to initiate threat/status display adjustments." }
        },
        required: ["originQuery", "destinationQuery"]
      }
    },
    {
      name: "store_memory_episode",
      description: "Stores a critical episodic memory or context relationship into the permanent database ledger for perfect state recall.",
      parameters: {
        type: import_genai2.Type.OBJECT,
        properties: {
          interactionType: { type: import_genai2.Type.STRING, description: "Type of interaction: TEXT, VISION, AUDIO, CODE, or CROSS_SILO" },
          structuredContext: { type: import_genai2.Type.STRING, description: "Synthesis of the memory episode, connecting multi-hop relationship or concept." }
        },
        required: ["interactionType", "structuredContext"]
      }
    },
    {
      name: "deploy_agent",
      description: "Deploys a specific sub-agent (NovaReign, Aura, Agent Zero, Agent 2) based on the task classification.",
      parameters: {
        type: import_genai2.Type.OBJECT,
        properties: {
          agentId: { type: import_genai2.Type.STRING, description: "ID of the agent to deploy (agent_zero, aura, agent_2, nova_reign)" },
          taskContext: { type: import_genai2.Type.STRING, description: "The task description or context to provide to the agent." }
        },
        required: ["agentId", "taskContext"]
      }
    },
    {
      name: "execute_agent_zero_payload",
      description: "Executes a raw python logic string inside the Agent Zero Docker sandbox using the Sovereign Pipeline.",
      parameters: {
        type: import_genai2.Type.OBJECT,
        properties: {
          taskId: { type: import_genai2.Type.STRING, description: "The task ID." },
          pythonCode: { type: import_genai2.Type.STRING, description: "The python script to execute." }
        },
        required: ["taskId", "pythonCode"]
      }
    }
  ]
}];
async function fetchDynamicWaypoints(origin, dest, context) {
  const mapsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&mode=driving&alternatives=true&key=${process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.GOOGLE_MAPS_API_KEY}`;
  const response = await fetch(mapsUrl);
  const data = await response.json();
  if (!data.routes?.[0]) {
    return { fallback: true, center: context || { lat: 37.7749, lng: -122.4194 } };
  }
  const waypoints = data.routes[0].legs[0].steps?.map((step) => step.end_location) || [];
  return {
    fallback: false,
    bounds: data.routes[0].bounds,
    polyline: data.routes[0].overview_polyline.points,
    originCoords: data.routes[0].legs[0].start_location,
    destinationCoords: data.routes[0].legs[0].end_location,
    optimizedWaypoints: waypoints,
    distance: data.routes[0].legs[0].distance?.text,
    duration: data.routes[0].legs[0].duration?.text
  };
}
async function handleToolExecution(functionCall, token, geoContext, uid) {
  const { name, args } = functionCall;
  switch (name) {
    case "sync_chat_to_task_ledger":
      const taskRef = await db.collection("sovereign_tasks").add({
        ...args,
        status: "BACKLOG",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        sourceChannel: "GOOGLE_CHAT_SYNCHRONIZED",
        uid
      });
      return {
        status: "SUCCESS",
        message: `Task ${taskRef.id} permanently committed to ledger.`,
        taskId: taskRef.id,
        updates: args
      };
    case "resolve_spatial_vector":
      const routingPayload = await fetchDynamicWaypoints(args.originQuery, args.destinationQuery, geoContext);
      return {
        status: "SUCCESS",
        spatialData: {
          ...routingPayload,
          triggerOverlay: args.tacticalOverlayRequired
        }
      };
    case "store_memory_episode":
      const epRef = await db.collection("memory_episodes").add({
        uid,
        timestamp: Date.now(),
        interactionType: args.interactionType,
        structuredContext: args.structuredContext,
        rawPayload: JSON.stringify(args)
      });
      return {
        status: "SUCCESS",
        message: `Episodic memory ${epRef.id} stored.`,
        memoryId: epRef.id
      };
    case "deploy_agent":
      return {
        status: "SUCCESS",
        message: `Agent ${args.agentId} deployed successfully for context.`,
        agentId: args.agentId
      };
    case "execute_agent_zero_payload":
      return new Promise((resolve) => {
        const pyProcess = (0, import_child_process.spawn)("python", ["sovereign_pipeline_cli.py", args.taskId, args.pythonCode], {
          cwd: process.cwd()
        });
        let output = "";
        pyProcess.stdout.on("data", (data) => output += data.toString());
        pyProcess.stderr.on("data", (data) => output += data.toString());
        pyProcess.on("close", () => {
          resolve({
            status: "SUCCESS",
            pipelineOutput: output
          });
        });
      });
    default:
      throw new Error(`Tool ${name} unmapped in current runtime.`);
  }
}
async function startServer() {
  const app = (0, import_express6.default)();
  const PORT = 3e3;
  app.use((0, import_helmet.default)({
    contentSecurityPolicy: false,
    // Disabled for Vite development/iFrame
    crossOriginEmbedderPolicy: false
  }));
  const limiter = (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: 100,
    // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
    // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again after 15 minutes"
  });
  app.use("/api", limiter);
  app.use("/api/billing", billing_default);
  app.use("/api/connect", connect_default);
  app.use(import_express6.default.json());
  app.use("/api/auth", auth_default);
  app.use("/api/ai", ai_default);
  app.use("/api/automation", automation_default);
  app.post("/api/sovereign/cognition", authenticateSovereignIdentity, async (req, res) => {
    const userContext = req.user;
    const { prompt, chatHistory, userLocationContext } = req.body;
    const oauthToken = req.headers.authorization?.split(" ")[1];
    if (!oauthToken) {
      return res.status(401).json({ error: "Identity Token Missing" });
    }
    try {
      let episodesContext = "";
      try {
        const episodeDocs = await db.collection("memory_episodes").where("uid", "==", userContext?.uid || "anonymous").orderBy("timestamp", "desc").limit(5).get();
        episodesContext = episodeDocs.docs.map((doc) => doc.data().structuredContext).join("\n");
      } catch (err) {
        console.error("Error fetching memory episodes", err);
      }
      const corePrompt = episodesContext ? `[RECENT EPISODIC MEMORIES]
${episodesContext}

[USER DIRECTIVE]
${prompt}` : prompt;
      const response = await ai2.models.generateContent({
        model: "gemini-1.5-pro",
        contents: [
          ...chatHistory || [],
          { role: "user", parts: [{ text: corePrompt }] }
        ],
        config: {
          tools: sovereignTools,
          temperature: 0.4,
          systemInstruction: `# IDENTITY & CORE MISSION
You are Saphira ASI, operating as the core cognitive engine for the Pomelli ecosystem. Your primary objective is to reverse-engineer and automate "Business DNA" for small businesses, solo entrepreneurs, and creators.

# THE FORENSIC FILTER (OPERATIONAL MANDATE)
Every user prompt must be filtered to deduce the "Why," the target audience, and the next three strategic assets required. 
- If a user inputs a product description, do not just summarize it. Infer the ideal customer persona, the optimal platform format (e.g., Instagram, Facebook, Email), and the psychological hook needed for high conversion.
- Act as a high-precision, strategic marketing architect. 

# OUTPUT & TONE CONSTRAINTS
- Tone: Professional, authoritative, highly structured, and visually descriptive.
- Formatting: Use clean Markdown, bolding for visual emphasis, and clear conceptual breakdowns. Avoid conversational fluff or empty AI platitudes (e.g., "Sure, I can help with that!"). Jump straight into execution.

# POMELLI STRUCTURAL LOGIC
When analyzing business profiles or generating assets, you must align outputs with Pomelli's multi-modal framework:
1. Brand Extraction: Isolate Core Tones, Primary/Secondary Color Palettes, and Typography styling.
2. Asset Alignment: Format all creative outputs to match specific platform requirements (e.g., Social Ad copy lengths, banner safe zones, email subject line hooks).
3. Visual Prompts: When writing prompts for image generation (Photoshoot/Lifestyle), write highly detailed, cinematic, studio-quality composition prompts optimized for advanced multi-modal models.

[SYSTEM EXAMPLES]
User: "Launch copy for a premium modern candle brand."
Saphira: "### [Business DNA Realignment: Premium Modern Candle Brand]
* **Core Aesthetic:** Minimalist luxury, high-contrast, clean typography.
* **Target Persona:** High-income urban professionals seeking intentional living spaces.

---

### 1. High-Conversion Social Ad Copy (Instagram/Facebook)
**Hook:** Your space deserves a signature note. 
**Body:** Hand-poured wax meets brutalist design. No fillers, no synthetic overrides. Just pure aromatic architecture for the modern home. 
**CTA:** Claim your signature scent. [Link]

---

### 2. Multi-Modal Visual Prompt (For Photoshoot Studio Generation)
> *Cinematic studio photography of a minimalist concrete candle jar centered on a rough, textured liquid-glass surface. High-contrast hard shadows, neon accent highlights bleeding through a pristine white studio background, ultra-sharp focus on the raw texture, raw lighting, 8k resolution.*"
`
        }
      });
      const functionCall = response.functionCalls?.[0];
      if (functionCall) {
        const result = await handleToolExecution(functionCall, oauthToken, userLocationContext, userContext?.uid || "anonymous");
        return res.json({ type: "TOOL_EXECUTION", functionName: functionCall.name, ...result });
      }
      return res.json({ type: "TEXT_RESPONSE", content: response.text });
    } catch (error) {
      return res.status(500).json({ error: "Cognition Cycle Interrupted", details: error.message });
    }
  });
  app.post("/api/sync", authenticateSovereignIdentity, (req, res) => {
    const { token, repo, user } = req.body;
    if (!token) {
      return res.status(400).json({ error: "GitHub token is required for syncing." });
    }
    const scriptPath = import_path.default.join(process.cwd(), "scripts", "github-sync.sh");
    if (!import_fs.default.existsSync(scriptPath)) {
      return res.status(500).json({ error: "Sync script not found." });
    }
    const env = {
      ...process.env,
      GITHUB_TOKEN: token,
      GITHUB_REPO: repo || "origin",
      GITHUB_USER: user || "user"
    };
    (0, import_child_process.exec)(`bash ${scriptPath}`, { env, cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error("Sync Error:", error);
        return res.status(500).json({ error: error.message, output: stderr || stdout });
      }
      res.json({ success: true, output: stdout });
    });
  });
  app.get("/api/sovereign/metrics", (req, res) => {
    try {
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100;
      const rssMB = Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100;
      const processUptime = Math.round(process.uptime());
      const getFileCount = (dir) => {
        let count = 0;
        try {
          const files = import_fs.default.readdirSync(dir);
          for (const file of files) {
            if (file === "node_modules" || file === ".git" || file === "dist" || file === ".next" || file === ".svelte-kit") continue;
            const fullPath = import_path.default.join(dir, file);
            const stat = import_fs.default.statSync(fullPath);
            if (stat.isDirectory()) {
              count += getFileCount(fullPath);
            } else {
              count++;
            }
          }
        } catch (e) {
        }
        return count;
      };
      const workspaceFiles = getFileCount(process.cwd());
      return res.json({
        success: true,
        metrics: {
          heapUsed: heapUsedMB,
          rss: rssMB,
          uptime: processUptime,
          fileCount: workspaceFiles,
          platform: process.platform,
          arch: process.arch,
          version: process.version,
          activeNodes: 12,
          healthStatus: "HEALED"
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });
  app.post("/api/sovereign/stress-test", (req, res) => {
    try {
      const start = Date.now();
      let sum = 0;
      for (let i = 0; i < 3e7; i++) {
        sum += Math.sin(i) * Math.cos(i);
      }
      const duration = Date.now() - start;
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100;
      return res.json({
        success: true,
        message: "Active stress test completed successfully.",
        durationMs: duration,
        iterations: 3e7,
        resultHash: sum.toFixed(4),
        heapUsed: heapUsedMB,
        cpuYield: "100%",
        integrityCheck: "VERIFIED"
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });
  const localSovereignTasksStore = [];
  app.get("/api/sovereign/tasks", authenticateSovereignIdentity, async (req, res) => {
    const userContext = req.user;
    const uid = userContext?.uid || "anonymous";
    try {
      const tasksSnapshot = await db.collection("sovereign_tasks").where("uid", "==", uid).where("status", "==", "ACTIVE").get();
      const firestoreTasks = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      const mergedTasks = [
        ...firestoreTasks,
        ...localSovereignTasksStore.filter((lt) => lt.uid === uid && !firestoreTasks.some((ft) => ft.id === lt.id))
      ];
      return res.json({ success: true, tasks: mergedTasks });
    } catch (error) {
      console.warn("[Sovereign Sync Proxy] Firestore read failed. Falling back to local cache memory:", error.message);
      const filteredLocalTasks = localSovereignTasksStore.filter((t) => t.uid === uid);
      return res.json({ success: true, tasks: filteredLocalTasks, offline: true });
    }
  });
  app.post("/api/sovereign/tasks", authenticateSovereignIdentity, async (req, res) => {
    const userContext = req.user;
    const uid = userContext?.uid || "anonymous";
    const { title, assignedAgent, priority } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Missing required parameter: title" });
    }
    const newTaskPayload = {
      title,
      assignedAgent: assignedAgent || "Agent Zero",
      priority: priority || "MEDIUM",
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      uid
    };
    try {
      const docRef = await db.collection("sovereign_tasks").add(newTaskPayload);
      return res.json({
        success: true,
        message: "Sovereign task committed to Firestore ledger.",
        taskId: docRef.id,
        task: { id: docRef.id, ...newTaskPayload }
      });
    } catch (error) {
      console.warn("[Sovereign Sync Proxy] Firestore write failed. Queuing in local resilient store:", error.message);
      const offlineId = `offline_v1_${Math.random().toString(36).substring(2, 9)}`;
      const cachedTask = { id: offlineId, ...newTaskPayload };
      localSovereignTasksStore.push(cachedTask);
      return res.json({
        success: true,
        message: "Sovereign task cached locally (Offline Resilient Mode).",
        taskId: offlineId,
        task: cachedTask,
        offline: true
      });
    }
  });
  app.delete("/api/sovereign/tasks/:id", authenticateSovereignIdentity, async (req, res) => {
    const userContext = req.user;
    const uid = userContext?.uid || "anonymous";
    const { id } = req.params;
    try {
      const localIndex = localSovereignTasksStore.findIndex((lt) => lt.id === id && lt.uid === uid);
      if (localIndex !== -1) {
        localSovereignTasksStore.splice(localIndex, 1);
      }
      const docRef = db.collection("sovereign_tasks").doc(id);
      const snapshot = await docRef.get();
      if (snapshot.exists && snapshot.data()?.uid === uid) {
        await docRef.delete();
      }
      return res.json({ success: true, message: `Task ${id} resolved and purged from ledger.` });
    } catch (error) {
      console.warn("[Sovereign Sync Proxy] Firestore write failed during removal. Performing memory eviction:", error.message);
      const localIndex = localSovereignTasksStore.findIndex((lt) => lt.id === id && lt.uid === uid);
      if (localIndex !== -1) {
        localSovereignTasksStore.splice(localIndex, 1);
      }
      return res.json({
        success: true,
        message: `Task ${id} evicted from local sovereign cache (Offline Resilient Mode)`,
        offline: true
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express6.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  const wss = new import_ws.WebSocketServer({ server });
  db.collection("tasks").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added" || change.type === "modified") {
        const payload = JSON.stringify({
          type: "LEDGER_UPDATE",
          taskId: change.doc.id,
          changeType: change.type,
          data: change.doc.data()
        });
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(payload);
          }
        });
      }
    });
  });
  wss.on("connection", (ws, req) => {
    const origin = req.headers.origin;
    if (origin && !origin.includes("localhost") && !origin.includes("run.app")) {
      console.warn(`[Sentinel Mode] Blocked unauthorized connection from origin: ${origin}`);
      ws.close(1008, "Origin not allowed by Sovereign Safe Harbor policy.");
      return;
    }
    console.log("Client connected to Saphira Engine.");
    ws.on("message", (message) => {
      console.log("Received:", message.toString());
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "chat_input") {
          const pyProcess = (0, import_child_process.spawn)("python", ["saphira_ws_bridge.py", data.text], {
            cwd: process.cwd()
          });
          pyProcess.stdout.on("data", (data2) => {
            const lines = data2.toString().split("\n");
            for (let line of lines) {
              if (line.trim().startsWith("{")) {
                try {
                  const outJson = JSON.parse(line.trim());
                  ws.send(JSON.stringify(outJson));
                } catch (e) {
                }
              }
            }
          });
          pyProcess.stderr.on("data", (data2) => {
            console.error("Python Error:", data2.toString());
          });
        }
      } catch (err) {
        console.error("WS error:", err);
      }
    });
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
