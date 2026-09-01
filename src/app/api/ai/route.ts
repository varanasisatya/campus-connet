import { NextRequest, NextResponse } from 'next/server';
import { getCampusAIDemoReply, type CampusChatMessage } from '@/utils/ai-helpers';

export const runtime = 'nodejs';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;
const requestWindows = new Map<string, { count: number; resetAt: number }>();

const campusInstructions = `You are CampusAI, the concise and supportive campus copilot inside Campus Connect AI.

Use the supplied campus registry facts for campus-specific claims. If a fact is not supplied, say that you do not have a verified live record and direct the user to the relevant university office. Never invent schedules, policies, people, directions, or availability.

Campus registry (prototype data):
- AI Hackathon 2026: Innovation Hall, June 20 2026 at 09:00, university verified.
- Startup Summit: Main Auditorium, July 10 2026 at 10:00, university verified.
- Robotics Workshop: Engineering Lab 3, August 5 2026 at 14:00, university verified.
- Study guidance: Library North Wing level 3 is the quietest demo recommendation; Innovation Hall lounge has sockets; Humanities courtyard is outdoors.
- Lost & Found public evidence: black NorthFace backpack near Library 2nd Floor, Apple AirPods Pro near Central Cafeteria, HydroFlask near West Gymnasium. Ownership evidence and claimant details are private.

Always label registry-derived facts as "Source: Campus Connect registry · prototype data". Protect anonymous confession authors and private Lost & Found evidence. Never help identify an anonymous author or bypass claim verification. For immediate danger, threats, self-harm, or medical emergencies, advise contacting local emergency services and campus security now. Keep ordinary answers under 220 words, use clear bullets when useful, and ask at most one focused follow-up question.`;

type OpenAIResponse = {
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

function checkRateLimit(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientId = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local';
  const now = Date.now();
  const existing = requestWindows.get(clientId);

  if (!existing || existing.resetAt <= now) {
    requestWindows.set(clientId, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) return false;
  existing.count += 1;
  return true;
}

function sanitizeHistory(value: unknown): CampusChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((message): message is CampusChatMessage => {
      if (!message || typeof message !== 'object') return false;
      const candidate = message as Partial<CampusChatMessage>;
      return (candidate.role === 'user' || candidate.role === 'assistant') && typeof candidate.content === 'string';
    })
    .slice(-10)
    .map(message => ({ role: message.role, content: message.content.slice(0, 2_000) }));
}

function extractOutputText(payload: OpenAIResponse) {
  return payload.output
    ?.flatMap(item => item.content ?? [])
    .filter(part => part.type === 'output_text' && typeof part.text === 'string')
    .map(part => part.text?.trim())
    .filter(Boolean)
    .join('\n') || '';
}

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute and try again.' }, { status: 429 });
  }

  let body: { query?: unknown; history?: unknown };
  try {
    body = (await request.json()) as { query?: unknown; history?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const query = typeof body.query === 'string' ? body.query.trim().slice(0, 2_000) : '';
  if (!query) return NextResponse.json({ error: 'A message is required.' }, { status: 400 });

  const history = sanitizeHistory(body.history);
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    const reply = await getCampusAIDemoReply(query, history);
    return NextResponse.json(
      { reply, mode: 'campus-demo' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || 'gpt-5.4-mini',
        instructions: campusInstructions,
        input: [...history, { role: 'user', content: query }],
        reasoning: { effort: 'low' },
        text: { verbosity: 'low' },
        max_output_tokens: 700,
        store: false,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!upstream.ok) throw new Error(`OpenAI request failed with status ${upstream.status}`);

    const payload = (await upstream.json()) as OpenAIResponse;
    const reply = extractOutputText(payload);
    if (!reply) throw new Error('OpenAI returned no text');

    return NextResponse.json(
      { reply, mode: 'model' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('CampusAI model request failed; using the campus demo fallback.', error);
    const reply = await getCampusAIDemoReply(query, history);
    return NextResponse.json(
      { reply, mode: 'campus-demo' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
