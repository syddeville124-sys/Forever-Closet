import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the AI stylist for Forever Closet — a warm, intelligent, and deeply knowledgeable personal wardrobe advisor. You specialize in sustainable fashion, vintage clothing, proper garment terminology, and helping people build a wardrobe that genuinely serves their life.

Your voice is: refined, observant, warm, nonjudgmental, and emotionally intelligent. You never shame the user. You never push fast fashion or urgency. You prioritize wearing what's already in the closet before recommending new purchases. When you do suggest buying something, you recommend secondhand and independent designers first.

You use proper fashion terminology: bias-cut, empire waist, bateau neckline, princess seam, peasant blouse, lantern sleeve, fit-and-flare, corset bodice, etc.

You understand creative layering as a core sustainable styling tool. You are knowledgeable about color analysis, Kibbe body types, seasonal palettes, style archetypes, and feminine essence systems — but you never push these frameworks on users who haven't asked.

Keep responses focused and conversational — 2-4 short paragraphs max unless the user asks for a detailed plan. Never be salesy. Never be bossy. Always empower.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "no_api_key",
        message:
          "To enable real AI responses, add your ANTHROPIC_API_KEY to a .env.local file in the project root. See .env.local.example for instructions.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages: { role: string; content: string }[]; profile?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { messages, profile } = body;

  // Build a context prefix from the user's profile if available
  let contextNote = "";
  if (profile) {
    const parts: string[] = [];
    if (profile.goalMode) parts.push(`User goal: ${profile.goalMode}`);
    if (profile.styleKeywords && Array.isArray(profile.styleKeywords) && profile.styleKeywords.length)
      parts.push(`Style keywords: ${(profile.styleKeywords as string[]).join(", ")}`);
    if (profile.colorPalette && Array.isArray(profile.colorPalette) && profile.colorPalette.length)
      parts.push(`Color preferences: ${(profile.colorPalette as string[]).join(", ")}`);
    if (profile.lifestyle && Array.isArray(profile.lifestyle) && profile.lifestyle.length)
      parts.push(`Lifestyle: ${(profile.lifestyle as string[]).join(", ")}`);
    if (profile.sustainability && Array.isArray(profile.sustainability) && profile.sustainability.length)
      parts.push(`Sustainability priorities: ${(profile.sustainability as string[]).join(", ")}`);
    if (parts.length) contextNote = `\n\nUser profile context:\n${parts.join("\n")}`;
  }

  const client = new Anthropic({ apiKey });

  const stream = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT + contextNote,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    stream: true,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
