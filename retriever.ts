import fs from "fs";
import path from "path";
import { DocumentChunk, RetrievalResult } from "@/types";
import { tokenize, tfidfVector, cosineSimilarity } from "@/lib/utils";
import { EMBEDDINGS_FILE, RAG_TOP_K, RAG_MIN_SCORE } from "@/lib/constants";

interface VectorStore {
  chunks: DocumentChunk[];
  idf: [string, number][];
}

let store: VectorStore | null = null;

function loadStore(): VectorStore | null {
  try {
    const filePath = path.join(process.cwd(), EMBEDDINGS_FILE);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as VectorStore;
  } catch {
    return null;
  }
}

export function getStore(): VectorStore | null {
  if (!store) store = loadStore();
  return store;
}

export function retrieve(query: string, topK = RAG_TOP_K): RetrievalResult[] {
  const s = getStore();
  if (!s || s.chunks.length === 0) return [];

  const idfMap = new Map<string, number>(s.idf);
  const queryTokens = tokenize(query);
  const queryVec = tfidfVector(queryTokens, idfMap);

  const results: RetrievalResult[] = s.chunks.map((chunk) => {
    const chunkTokens = tokenize(chunk.content);
    const chunkVec = tfidfVector(chunkTokens, idfMap);
    const score = cosineSimilarity(queryVec, chunkVec);
    return { chunk, score };
  });

  return results
    .filter((r) => r.score >= RAG_MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function buildContext(results: RetrievalResult[]): string {
  if (results.length === 0) return "";
  const parts = results.map(
    (r) => `[Source: ${r.chunk.title}]\n${r.chunk.content}`
  );
  return `\n\n--- Relevant Context ---\n${parts.join("\n\n")}\n--- End Context ---\n`;
}
