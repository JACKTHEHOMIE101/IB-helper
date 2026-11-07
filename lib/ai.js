// Calls Claude for the app's AI features: grading, follow-ups, debriefs, call prep and story drafts.
// The browser sends the full prompt (the same prompts the app has always used); the server adds a system prompt,
// picks the model, enforces size limits and keeps the API key private.
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM =
  "You are the AI coach inside Superday Prep, an app that helps undergraduates prepare for investment banking interviews and networking. " +
  "Do the task in the user's message. When it asks for JSON, reply with the JSON only. " +
  "If a request has nothing to do with finance recruiting, interviewing or networking, reply briefly that you can only help with interview prep.";

export const MAX_INPUT_CHARS = 40000;

// Accepts a prompt string or a short [{role, content}] conversation that ends on a user turn.
export function normalizeInput(input) {
  let messages;
  if (typeof input === "string") messages = [{ role: "user", content: input }];
  else if (Array.isArray(input)) messages = input.map((m) => ({ role: m?.role, content: m?.content }));
  else return null;
  if (!messages.length || messages.length > 12) return null;
  if (!messages.every((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())) return null;
  if (messages[messages.length - 1].role !== "user") return null;
  if (messages.reduce((n, m) => n + m.content.length, 0) > MAX_INPUT_CHARS) return null;
  return messages;
}

export class RefusalError extends Error { constructor() { super("The AI declined this request."); this.code = "refused"; } }

export function createAI(env = process.env) {
  if (env.AI_FAKE === "1") return createFakeAI();
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const model = env.AI_MODEL || "claude-opus-5-5";
  const quickModel = env.AI_MODEL_QUICK || "claude-haiku-5-5";

  return {
    async complete({ messages, tier }) {
      const m = tier === "quick" ? quickModel : model;
      const params = {
        model: m,
        max_tokens: 16000,
        system: SYSTEM,
        messages,
        output_config: { effort: tier === "quick" ? "low" : "medium" },
      };
      // Server-side refusal fallbacks: if the model declines, the API retries on a recommended model in the same call.
      // Available on the Opus, Sonnet and Fable families; Haiku has no server-side fallback.
      const resp = /^claude-(opus|sonnet|fable)-/.test(m)
        ? await client.beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" })
        : await client.messages.create(params);
      if (resp.stop_reason === "refusal") throw new RefusalError();
      const text = resp.content.filter((b) => b.type === "text").map((b) => b.text).join("");
      return { text, truncated: resp.stop_reason === "max_tokens" };
    },
  };
}

// Deterministic stand-in for local development and tests: no API key, no cost.
// Returns one JSON object containing every field the app's prompts ask for.
export function createFakeAI() {
  const json = {
    score: 7, verdict: "Pass",
    strengths: ["Clear headline first", "Correct direction on cash"],
    gaps: ["Mention the tax effect explicitly", "Tie it back to the balance sheet"],
    model_answer: "Start with the headline, then walk through each statement in order: income statement, cash flow statement, balance sheet.",
    follow_up: "What changes if the tax rate is 21% instead?",
    headline: "Solid fundamentals; tighten the technical walk-throughs.",
    fixes: ["State the tax effect every time", "Shorten the resume story to 90 seconds", "Practice paper LBO math"],
    plan: ["Drill 20 accounting cards", "Run one superday simulation", "Do two paper LBOs"],
    opener: "Thanks for making the time. I'm a student working toward an investment banking internship and I'd love to hear how you got to your firm.",
    questions: ["What does a typical week look like in your group?", "What surprised you in your first year?", "How did you approach recruiting?", "What separates the best analysts?", "Who else would you suggest I speak with?"],
    avoid: ["Don't ask about pay", "Don't ask for a referral outright"],
    close: "This was really helpful. Could I follow up as recruiting gets closer?",
    answer: "Two things draw me to the firm: the people I've spoken with and the deal flow in the group. [Add one specific detail from a conversation.]",
    talking_points: ["People you've spoken with", "The group's focus", "Early responsibility"],
    ask_interviewer: ["What's a deal you enjoyed recently?", "What do top analysts do differently?", "How is the group's pipeline changing?"],
    story: "I grew up in [hometown] and chose my school because [reason]. I got interested in finance when [moment]. At [experience], I [what you did], which taught me [lesson]. That's why I'm pursuing investment banking: I want to work on the transactions behind the companies I've been studying.",
    beats: [{ label: "Background", cue: "Hometown, school", seconds: 15 }, { label: "The spark", cue: "When finance clicked", seconds: 20 }, { label: "Experience", cue: "Role, task, lesson", seconds: 35 }, { label: "Why banking", cue: "Transactions", seconds: 20 }],
    follow_ups: ["What did you do day to day in your last role?", "What's the most analytical project on your resume?"],
    flags: [],
  };
  return {
    async complete({ messages }) {
      const last = messages[messages.length - 1].content;
      if (/JSON only/i.test(last)) return { text: JSON.stringify(json), truncated: false };
      return { text: "What happens to free cash flow if the tax rate is 21% instead?", truncated: false };
    },
  };
}
