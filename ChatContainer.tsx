"use client";
import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { PersonaSelector } from "./PersonaSelector";
import { useChat } from "@/hooks/useChat";
import { usePersona } from "@/hooks/usePersona";
import { Message, generateId } from "@/types";
import { Trash2 } from "lucide-react";

// re-export generateId so Message can use it
function makeStreamingMessage(content: string, personaId: import("@/types").PersonaId): Message {
  return { id: "streaming", role: "assistant", content, timestamp: new Date(), persona: personaId };
}

export function ChatContainer() {
  const { personaId, persona, setPersona } = usePersona();
  const { messages, isLoading, error, streamingContent, sendMessage, clearMessages } = useChat(personaId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.08] backdrop-blur-xl relative animate-[pulseGlow_4s_ease-in-out_infinite]"
      style={{ background: "rgba(6, 6, 18, 0.85)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.06))" }}>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 animate-[float_3s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(135deg, ${persona.color}, ${persona.accentColor}, #f59e0b)`,
            backgroundSize: "200% 200%",
            animation: "gradientShift 3s ease infinite, float 3s ease-in-out infinite",
            boxShadow: `0 0 20px ${persona.color}88`,
          }}
        >
          {persona.emoji}
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-orbitron)] text-lg font-black tracking-widest"
            style={{ background: `linear-gradient(90deg, ${persona.accentColor}, #f472b6, #fbbf24)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {persona.name.toUpperCase()}
          </h2>
          <p className="text-[10px] tracking-[3px] uppercase" style={{ color: `${persona.accentColor}80` }}>
            {persona.title} · Siggytarius AI
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          {messages.length > 0 && (
            <button onClick={clearMessages} title="Clear chat"
              className="text-white/20 hover:text-white/60 transition-colors">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Persona selector */}
      <PersonaSelector current={personaId} onChange={setPersona} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-16">
            <div className="text-5xl animate-[float_3s_ease-in-out_infinite]">{persona.emoji}</div>
            <p className="font-[family-name:var(--font-orbitron)] text-sm tracking-widest"
              style={{ color: `${persona.accentColor}aa` }}>
              {persona.name.toUpperCase()} IS READY
            </p>
            <p className="text-white/25 text-xs max-w-xs">{persona.description}</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && streamingContent && (
          <ChatMessage
            message={makeStreamingMessage(streamingContent, personaId)}
            isStreaming
          />
        )}
        {isLoading && !streamingContent && (
          <div className="flex gap-3 items-end">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: `linear-gradient(135deg, ${persona.color}, ${persona.accentColor})` }}>
              {persona.emoji}
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10 flex gap-1.5 items-center">
              {[0, 200, 400].map((delay) => (
                <span key={delay} className="w-2 h-2 rounded-full bg-violet-400 animate-[bounceDot_1.2s_ease-in-out_infinite]"
                  style={{ animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="text-xs text-red-400/70 text-center px-4 py-2 rounded-lg bg-red-900/20 border border-red-900/30">
            ⚡ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
