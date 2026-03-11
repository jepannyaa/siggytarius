"use client";
import { useState, useEffect } from "react";
import { PersonaId, PERSONAS, Persona } from "@/types";

const STORAGE_KEY = "siggytarius_persona";

export function usePersona() {
  const [personaId, setPersonaId] = useState<PersonaId>("siggy");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PersonaId | null;
      if (saved && saved in PERSONAS) setPersonaId(saved);
    } catch { /* SSR safety */ }
  }, []);

  const setPersona = (id: PersonaId) => {
    setPersonaId(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* ignore */ }
  };

  const persona: Persona = PERSONAS[personaId];

  return { personaId, persona, setPersona, personas: PERSONAS };
}
