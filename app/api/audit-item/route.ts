import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "no_api_key" }, { status: 503 });
  }

  const { item, profile, closetSize } = await req.json();

  const client = new Anthropic({ apiKey });

  const itemSummary = [
    `Name: ${item.name}`,
    `Category: ${item.category}`,
    item.colorName ? `Color: ${item.colorName}` : "",
    item.fabric ? `Fabric: ${item.fabric}` : "",
    item.silhouette ? `Silhouette: ${item.silhouette}` : "",
    item.garmentType ? `Type: ${item.garmentType}` : "",
    item.eraInfluence ? `Era influence: ${item.eraInfluence}` : "",
    item.tags?.length ? `Tags: ${item.tags.join(", ")}` : "",
    `Times worn: ${item.worn ?? 0}`,
    item.badge && item.badge !== "Keep" ? `Current status: ${item.badge}` : "",
    item.notes ? `Notes: ${item.notes}` : "",
  ].filter(Boolean).join("\n");

  const profileSummary = profile ? [
    profile.styleKeywords?.length ? `Style: ${profile.styleKeywords.slice(0, 6).join(", ")}` : "",
    profile.lifestyle?.length ? `Lifestyle: ${profile.lifestyle.join(", ")}` : "",
    profile.sustainability?.length ? `Sustainability: ${profile.sustainability.join(", ")}` : "",
    profile.goalMode ? `Goal: ${profile.goalMode}` : "",
  ].filter(Boolean).join("\n") : "";

  const prompt = `You are a thoughtful wardrobe editor helping someone audit their closet. Analyze this single item and give an honest, empathetic recommendation.

Item:
${itemSummary}

${profileSummary ? `User's style profile:\n${profileSummary}\n` : ""}
Closet size: ${closetSize ?? "unknown"} items

Return ONLY valid JSON (no markdown) with exactly these fields:
{
  "verdict": "one of: Keep, Style More, Alter, Archive, Sell, Donate, Release",
  "confidence": "high or medium",
  "reason": "2-3 sentences explaining WHY — be specific, warm, and honest. Reference the item's actual attributes and how they relate to the user's style. Avoid generic advice.",
  "tip": "one actionable sentence — a specific styling idea if keeping, a platform if selling (Depop, ThredUp, Poshmark), or an alteration suggestion if altering",
  "wornScore": "low (0-3 times), medium (4-10), high (11+)"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  try {
    const result = JSON.parse(text.trim());
    return Response.json(result);
  } catch {
    return Response.json({ error: "parse_failed", raw: text }, { status: 500 });
  }
}
