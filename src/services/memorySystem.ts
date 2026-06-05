export interface MemoryContext {
  userId: string;
  preferences: Record<string, string>;
  history: { role: string; content: string; timestamp: number }[];
  contextBlocks: string[];
}

const memoryStore = new Map<string, MemoryContext>();

export class MemorySystem {
  static initUser(userId: string) {
    if (!memoryStore.has(userId)) {
      memoryStore.set(userId, {
        userId,
        preferences: {},
        history: [],
        contextBlocks: []
      });
    }
    return memoryStore.get(userId)!;
  }

  static addHistory(userId: string, role: string, content: string) {
    const memory = this.initUser(userId);
    memory.history.push({ role, content, timestamp: Date.now() });
    
    // Keep last 50 messages
    if (memory.history.length > 50) {
      memory.history.shift();
    }
  }

  static updatePreference(userId: string, key: string, value: string) {
    const memory = this.initUser(userId);
    memory.preferences[key] = value;
  }

  static addContext(userId: string, context: string) {
    const memory = this.initUser(userId);
    if (!memory.contextBlocks.includes(context)) {
      memory.contextBlocks.push(context);
    }
  }

  static getContextString(userId: string): string {
    const memory = this.initUser(userId);
    let str = "User Context:\\n";
    str += `Preferences: ${JSON.stringify(memory.preferences)}\\n`;
    if (memory.contextBlocks.length > 0) {
      str += `Key Information: \\n- ${memory.contextBlocks.join('\\n- ')}\\n`;
    }
    return str;
  }
}
