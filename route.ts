import { NextRequest } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { SYSTEM_PROMPTS } from "@/lib/prompts";
import { retrieve, buildContext } from "@/lib/rag/retriever";
import { GROQ_MODEL, MAX_TOKENS, TEMPERATURE } from "@/lib/constants";
import { ChatRequest } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, persona = "siggy", useRag = true } = body;

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    const groq = getGroqClient();
    const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";

    // RAG retrieval
    let systemPrompt = SYSTEM_PROMPTS[persona];
    if (useRag && lastUserMessage) {
      const results = retrieve(lastUserMessage);
      if (results.length > 0) {
        systemPrompt += buildContext(results);
      }
    }

    // Build message list for Groq
    const groqMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      messages: groqMessages,
      stream: true,
    });

    // SSE streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[/api/chat]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
