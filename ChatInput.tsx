"use client";
import { useState, useRef, useCallback } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, disabled, onSend]);

  return (
    <div className="flex gap-3 items-end p-4 border-t border-white/[0.06] bg-[#060612]/90">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
        }}
        placeholder="Ask Siggy anything..."
        rows={1}
        disabled={disabled}
        className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-[#e2d9f3] text-sm placeholder-white/20 resize-none outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all min-h-[48px] max-h-[120px] font-[family-name:var(--font-rajdhani)] leading-relaxed"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-900/50 hover:scale-105 hover:shadow-violet-600/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {disabled ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send size={16} />
        )}
      </button>
    </div>
  );
}
