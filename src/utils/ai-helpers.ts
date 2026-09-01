export type CampusChatMessage = { role: 'user' | 'assistant'; content: string };
export type CampusAIReply = { content: string; mode: 'model' | 'campus-demo' };

export async function getEventRecommendations(userId: string, currentEvents: any[]) {
  await new Promise(resolve => setTimeout(resolve, 700));
  return currentEvents.map(event => ({ ...event, aiScore: Math.floor(Math.random() * 100) })).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
}

export async function getLostItemMatchConfidence(lostItemId: string, foundItems: any[]) {
  await new Promise(resolve => setTimeout(resolve, 650));
  const confidenceMap: Record<string, number> = {};
  foundItems.forEach(item => { confidenceMap[item.id] = Math.floor(Math.random() * 100); });
  return confidenceMap;
}

const includesAny = (text: string, terms: string[]) => terms.some(term => text.includes(term));

export async function getCampusAIDemoReply(query: string, history: CampusChatMessage[] = []) {
  await new Promise(resolve => setTimeout(resolve, 650));
  const normalized = query.toLowerCase().trim();
  const priorContext = history
    .filter(message => message.role === 'user')
    .slice(-3)
    .map(message => message.content.toLowerCase())
    .join(' ');
  const isShortFollowUp = normalized.split(/\s+/).length <= 3;
  const context = isShortFollowUp ? `${priorContext} ${normalized}` : normalized;

  if (includesAny(normalized, ['hello', 'hey', 'hi ', 'good morning', 'good evening'])) {
    return "Hey! I’m CampusAI—your shortcut through campus life.\n\nI can help you discover events, locate a lost item, find a quieter study spot, understand campus updates, or plan your day. What are we figuring out?";
  }
  if (includesAny(context, ['event', 'hackathon', 'workshop', 'summit', 'club', 'what is happening', "what's happening"])) {
    return "Here are your strongest campus matches right now:\n\n• AI Hackathon 2026 — Innovation Hall, 9:00 AM · 98% match\n• Startup Summit — Main Auditorium, 10:00 AM · 85% match\n• Robotics Workshop — Engineering Lab 3, 2:00 PM · 72% match\n\nThe Hackathon is the best fit if you want to build and meet people. Want the details, directions, or a quick comparison?\n\nSource: Campus Connect event registry · demo data";
  }
  if (includesAny(context, ['lost', 'found', 'missing', 'backpack', 'airpods', 'bottle', 'belonging'])) {
    return "I can help investigate that. The latest evidence board shows:\n\n• Black NorthFace backpack — Library, 2nd floor · 93% visual match\n• Apple AirPods Pro — Central Cafeteria · 88% visual match\n• HydroFlask bottle — West Gymnasium · 45% signal\n\nTell me the item, colour, last location, and approximate time. I’ll narrow the trail without exposing private ownership details.\n\nSource: Privacy-filtered Lost & Found registry · demo data";
  }
  if (includesAny(context, ['library', 'study', 'quiet', 'seat', 'focus'])) {
    return "The main library is currently busy—about 85% capacity. Your best options are:\n\n1. North Wing, level 3 — quietest right now\n2. Innovation Hall lounge — moderate noise, plenty of sockets\n3. Humanities courtyard — best if you want fresh air\n\nFor deep focus, I’d choose North Wing. Want walking directions?\n\nSource: Campus occupancy feed · demo data";
  }
  if (includesAny(context, ['food', 'eat', 'lunch', 'dinner', 'cafeteria', 'coffee'])) {
    return "For food right now:\n\n• Central Cafeteria — full menu, busiest option\n• Quad pop-ups — quickest and most social\n• Innovation Café — coffee, sandwiches, reliable Wi‑Fi\n\nIf you have only 20 minutes, go to the Quad. If you want to work while eating, choose Innovation Café.";
  }
  if (includesAny(context, ['confession', 'feed', 'post', 'announcement', 'campus news'])) {
    return "The Campus Feed is where named updates, announcements, and anonymous Student Confessions live.\n\nAnonymous posts hide your identity and pass through a safety review before appearing. Named posts get automatic AI topic labels and short summaries.\n\nWould you like help drafting a post or a confession?";
  }
  if (includesAny(context, ['direction', 'where is', 'how do i get', 'location', 'navigate'])) {
    return "I can map that for you. Tell me your destination—or choose one: Innovation Hall, Main Auditorium, Library, Central Cafeteria, Engineering Lab 3, or West Gymnasium.\n\nIf you share your current campus landmark, I’ll give you a simple step-by-step route.";
  }
  if (includesAny(context, ['plan', 'schedule', 'my day', 'today'])) {
    return "Let’s shape a good campus day:\n\n09:00 — AI Hackathon check-in at Innovation Hall\n12:30 — Culture showcase on the Quad\n15:00 — Quiet study block in the Library North Wing\n18:30 — Student films and rooftop conversations\n\nTell me how much free time you have and whether you want productive, social, or relaxed—I’ll tailor it.";
  }
  if (includesAny(normalized, ['thank', 'thanks', 'perfect', 'great'])) {
    return "You’re welcome! If you want, I can take the next step too—compare events, narrow a lost-item match, find a study spot, or build the rest of your campus plan.";
  }
  return `I understand you’re asking about “${query.trim()}.” I can reason best with a little campus context.\n\nTell me one of these and I’ll give you a focused answer:\n• Where you are now\n• What you’re trying to do\n• When you need it\n• Whether you prefer quiet, social, or fast\n\nYou can also ask me directly about events, lost items, study spaces, food, directions, or the Campus Feed.`;
}

export async function askCampusAI(query: string, history: CampusChatMessage[] = []): Promise<CampusAIReply> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, history }),
  });

  if (!response.ok) throw new Error('CampusAI request failed');

  const data = (await response.json()) as { reply?: unknown; mode?: unknown };
  if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('CampusAI returned an invalid response');

  return {
    content: data.reply,
    mode: data.mode === 'model' ? 'model' : 'campus-demo',
  };
}
