import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "no_api_key" }, { status: 503 });
  }

  const { imageBase64, mimeType } = await req.json();

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType || "image/jpeg",
            data: imageBase64,
          },
        },
        {
          type: "text",
          text: `You are a fashion expert analyzing a clothing item photo. Return ONLY valid JSON (no markdown, no explanation) with exactly these fields:
{
  "name": "descriptive garment name using proper fashion terminology (e.g. 'Bias-cut Slip Dress', 'Puff Sleeve Peasant Blouse', 'Wide-Leg Linen Trousers')",
  "category": "one of: Tops, Bottoms, Dresses, Outerwear, Layering, Shoes, Accessories",
  "color": "dominant color as a CSS hex code (e.g. '#8B7355', '#F5E6D3', '#2F4538', '#C4A882'). Be precise — sample the most prominent color in the garment.",
  "colorName": "human-readable color name (e.g. 'Dusty rose', 'Forest green', 'Ivory cream', 'Camel')",
  "fabric": "fabric if visible (e.g. 'Linen', 'Satin', 'Cotton jersey', 'Silk chiffon', 'Unknown')",
  "silhouette": "silhouette description (e.g. 'A-line', 'Fitted', 'Relaxed oversized', 'Wrap', 'Empire waist')",
  "tags": ["3-5 style descriptors from: romantic, vintage, bohemian, minimalist, structured, gothic, cottagecore, fairycore, maximalist, earthy, feminine, dramatic, classic, relaxed, whimsical, statement, layering, versatile, preppy, edgy"],
  "eraInfluence": "era or style influence if apparent (e.g. '1970s boho', 'Victorian-inspired', 'Contemporary', '90s minimalist', 'Modern classic')",
  "garmentType": "specific garment type (e.g. 'Midi skirt', 'Blouse', 'Corset top', 'Blazer', 'Wrap dress')"
}`
        }
      ]
    }]
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const result = JSON.parse(text.trim());
    return Response.json(result);
  } catch {
    return Response.json({ error: "parse_failed", raw: text }, { status: 500 });
  }
}
