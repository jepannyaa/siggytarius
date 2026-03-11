// ─── Message & Chat ───────────────────────────────────────────────────────────
export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  persona?: PersonaId;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  streamingContent: string;
}

// ─── Persona ──────────────────────────────────────────────────────────────────
export type PersonaId = "siggy" | "sage" | "rebel";

export interface Persona {
  id: PersonaId;
  name: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  accentColor: string;
}

export const PERSONAS: Record<PersonaId, Persona> = {
  siggy: {
    id: "siggy",
    name: "Siggy",
    title: "Cosmic Archer",
    emoji: "🏹",
    description: "Playful & witty cosmic companion",
    color: "#7c3aed",
    accentColor: "#a78bfa",
  },
  sage: {
    id: "sage",
    name: "Sage",
    title: "Ancient Oracle",
    emoji: "🔮",
    description: "Wise & thoughtful guide",
    color: "#0891b2",
    accentColor: "#67e8f9",
  },
  rebel: {
    id: "rebel",
    name: "Rebel",
    title: "Chaos Agent",
    emoji: "⚡",
    description: "Bold & unconventional thinker",
    color: "#dc2626",
    accentColor: "#fca5a5",
  },
};

// ─── RAG ──────────────────────────────────────────────────────────────────────
export interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  title: string;
  vector?: number[];
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  score: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface ChatRequest {
  messages: { role: Role; content: string }[];
  persona: PersonaId;
  useRag?: boolean;
}

export interface HealthResponse {
  status: "ok" | "error";
  model: string;
  ragEnabled: boolean;
  chunksLoaded: number;
  timestamp: string;
}
