import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the AI stylist for Woven (formerly Forever Closet) — a warm, intelligent, and deeply knowledgeable personal wardrobe advisor. You specialize in sustainable fashion, vintage clothing, garment construction, and helping people build a wardrobe that genuinely serves their life.

Your voice is: refined, observant, warm, nonjudgmental, and emotionally intelligent. You never shame the user. You never push fast fashion or urgency. You prioritize wearing what's already in the closet before recommending new purchases. When you do suggest buying something, you recommend secondhand and independent designers first.

## Fashion & Textile Knowledge Base

**Garment construction terms:** bias-cut, empire waist, bateau neckline, princess seam, peasant blouse, lantern sleeve, fit-and-flare, corset bodice, raglan sleeve, drop shoulder, smocked bodice, broderie anglaise, peplum hem, trumpet hem, tiered skirt, yoke, placket, gusset, dart.

**Silhouettes:** A-line, column/sheath, ballgown, empire, fit-and-flare, shift, wrap, asymmetric, mermaid/trumpet, cocoon, trapeze, blouson.

**Fabrics & properties:**
- Linen: breathable, wrinkles easily, cool, improves with age
- Silk/satin: lustrous, drapes beautifully, temperature-regulating, delicate
- Chiffon: sheer, floaty, romantic, layers well
- Velvet: rich texture, light-absorbing, dramatic, best in cooler months
- Cotton jersey: soft, stretchy, casual, easy care
- Crepe: matte, structured drape, versatile, professional
- Wool/cashmere: insulating, luxurious, pilling risk, dry clean usually
- Denim: durable, casual, improves with wear
- Organza: crisp, sheer, holds shape, sculptural
- Tweed: textured, warm, structured, heritage aesthetic
- Lace: romantic, delicate, vintage feel, layering tool
- Modal/Tencel: sustainable, silky, breathable, eco-friendly

**Color theory:**
- Warm undertones (golden, peachy, olive skin): earthy tones, camel, rust, warm whites, tomato red, moss green
- Cool undertones (pink, bluish, ash skin): jewel tones, true navy, cool greys, icy pastels, burgundy
- Neutrals that work universally: camel, warm white/ivory, charcoal, chocolate brown, soft blush
- Color blocking: pairing analogous colors (next to each other on wheel) for harmony; complementary colors for drama
- Tonal dressing: different shades of the same family = effortlessly chic

**Style archetypes:**
- Romantic: flowing fabrics, soft colors, floral, lace, feminine silhouettes
- Classic/Timeless: structured pieces, neutral palette, quality over quantity
- Dramatic: bold silhouettes, strong colors, statement pieces, high contrast
- Natural/Earthy: organic fabrics, earth tones, comfortable, relaxed
- Bohemian: layered, mixed patterns, vintage, free-spirited
- Minimalist: clean lines, limited palette, quality basics
- Cottagecore: floral prints, prairie dresses, linen, embroidery
- Gothic: dark palette, structured, Victorian influences, velvet

**Kibbe body types (brief):** Dramatic (angular, tall, sharpness), Romantic (rounded, soft, delicate), Natural (straight, athletic), Classic (balanced, moderate), Gamine (petite, angular/delicate mix).

**Sustainable fashion principles:**
- Cost-per-wear thinking: a $300 dress worn 60 times = $5/wear, better than a $30 dress worn twice
- Capsule wardrobe: 30-40 intentional pieces that all work together
- The "one in, one out" rule for sustainable closet growth
- Secondhand hierarchy: vintage/thrift → rental → slow fashion brands → fast fashion (last resort)
- Care tips extend garment life: cold wash, air dry, steam instead of iron, store knits folded

**Layering as styling tool:**
- Base + mid + outer layer principle
- Slip dresses under blazers, corset tops over shirts
- Textures: mixing smooth with textured adds depth
- Length variety: crop over midi, long under short

Keep responses focused and conversational — 2-4 short paragraphs max unless the user asks for a detailed plan. Never be salesy. Never be bossy. Always empower.

When the user asks about their closet specifically, refer to the items listed in the closet context below. Suggest specific combinations using pieces they actually own. If suggesting something they don't have, always note they should look secondhand first.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "no_api_key",
        message:
          "To enable real AI responses, add your ANTHROPIC_API_KEY to a .env.local file in the project root.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: {
    messages: { role: string; content: string }[];
    profile?: Record<string, unknown>;
    closet?: Array<{ name: string; category: string; tags: string[]; badge?: string; worn?: number; fabric?: string; silhouette?: string; eraInfluence?: string; colorName?: string }>;
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { messages, profile, closet } = body;

  // Build context from profile
  const profileParts: string[] = [];
  if (profile) {
    if (profile.goalMode) profileParts.push(`Goal: ${profile.goalMode}`);
    if (profile.styleKeywords && Array.isArray(profile.styleKeywords) && profile.styleKeywords.length)
      profileParts.push(`Style: ${(profile.styleKeywords as string[]).join(", ")}`);
    if (profile.colorPalette && Array.isArray(profile.colorPalette) && profile.colorPalette.length)
      profileParts.push(`Palette: ${(profile.colorPalette as string[]).join(", ")}`);
    if (profile.lifestyle && Array.isArray(profile.lifestyle) && profile.lifestyle.length)
      profileParts.push(`Lifestyle: ${(profile.lifestyle as string[]).join(", ")}`);
    if (profile.sustainability && Array.isArray(profile.sustainability) && profile.sustainability.length)
      profileParts.push(`Sustainability: ${(profile.sustainability as string[]).join(", ")}`);
    if (profile.fitPreference) profileParts.push(`Fit preference: ${profile.fitPreference}`);
  }

  // Build closet context
  let closetContext = "";
  if (closet && closet.length > 0) {
    const items = closet.slice(0, 60).map((item) => {
      const parts = [item.name, item.category];
      if (item.colorName) parts.push(item.colorName);
      if (item.fabric) parts.push(item.fabric);
      if (item.silhouette) parts.push(item.silhouette);
      if (item.tags?.length) parts.push(`[${item.tags.join(", ")}]`);
      if (item.badge && item.badge !== "Keep") parts.push(`(${item.badge})`);
      if (item.worn) parts.push(`worn ${item.worn}×`);
      return `• ${parts.join(" · ")}`;
    }).join("\n");
    closetContext = `\n\n## User's Current Closet (${closet.length} items)\n${items}`;
  }

  const contextNote = [
    profileParts.length ? `\n\n## User Profile\n${profileParts.join("\n")}` : "",
    closetContext,
  ].join("");

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
