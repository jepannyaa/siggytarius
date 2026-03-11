"use client";
import { useState, useCallback, useRef } from "react";
import { Message, PersonaId, ChatState } from "@/types";
import { generateId } from "@/lib/utils";

export function useChat(persona: PersonaId) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    streamingContent: "",
  });

  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.isLoading) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
        persona,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
        streamingContent: "",
      }));

      abortRef.current = new AbortController();

      try {
        const allMessages = [...state.messages, userMessage];
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
            persona,
            useRag: true,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              accumulated += parsed.content ?? "";
              setState((prev) => ({ ...prev, streamingContent: accumulated }));
            } catch { /* skip */ }
          }
        }

        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: accumulated,
          timestamp: new Date(),
          persona,
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
          streamingContent: "",
        }));
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          streamingContent: "",
          error: err instanceof Error ? err.message : "Something went wrong",
        }));
      }
    },
    [state.messages, state.isLoading, persona]
  );

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    setState({ messages: [], isLoading: false, error: null, streamingContent: "" });
  }, []);

  return { ...state, sendMessage, clearMessages };
}
