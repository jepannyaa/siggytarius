"use client";
import { Message, PERSONAS } from "@/types";
import { formatTime } from "@/lib/utils";

interface Props {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: Props) {
  const isUser = message.role === "user";
  const persona = message.persona ? PERSONAS[message.persona] : PERSONAS.siggy;

  return (
    <div className={`flex gap-3 items-end animate-[slideIn_0.3s_ease] ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 animate-[float_3s_ease-in-out_infinite]"
          style={{ background: `linear-gradient(135deg, ${persona.color}, ${persona.accentColor})`, boxShadow: `0 0 12px ${persona.color}88` }}
        >
          {persona.emoji}
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[72%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? "bg-gradient-to-br from-violet-700 to-violet-900 text-white rounded-br-sm border border-violet-500/40 shadow-lg shadow-violet-900/40"
          : "bg-gradient-to-br from-white/5 to-white/[0.02] text-[#e2d9f3] border border-white/10 rounded-bl-sm"
      }`}>
        <p className="whitespace-pre-wrap">{message.content}{isStreaming && <span className="ml-0.5 inline-block w-1.5 h-4 bg-violet-400 animate-pulse rounded-sm" />}</p>
        <span className={`text-[10px] mt-1.5 block ${isUser ? "text-violet-300/60 text-right" : "text-white/25"}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* User avatar placeholder */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs text-white flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
}
