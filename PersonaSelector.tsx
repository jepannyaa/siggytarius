"use client";
import { PersonaId, PERSONAS, Persona } from "@/types";

interface Props {
  current: PersonaId;
  onChange: (id: PersonaId) => void;
}

export function PersonaSelector({ current, onChange }: Props) {
  return (
    <div className="flex gap-2 p-3 border-b border-white/[0.06]">
      {(Object.values(PERSONAS) as Persona[]).map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          title={p.description}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            current === p.id
              ? "text-white shadow-md"
              : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/70"
          }`}
          style={current === p.id ? {
            background: `linear-gradient(135deg, ${p.color}cc, ${p.accentColor}66)`,
            border: `1px solid ${p.color}88`,
            boxShadow: `0 0 12px ${p.color}44`,
          } : undefined}
        >
          <span>{p.emoji}</span>
          <span className="font-[family-name:var(--font-orbitron)] tracking-wide">{p.name}</span>
        </button>
      ))}
    </div>
  );
}
