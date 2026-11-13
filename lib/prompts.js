// Every AI feature the app has. The browser sends a feature name and a few fields; the prompt is built here,
// so the API key can't be used for anything else. Each feature says whether it needs Pro, which model tier
// it uses, and how to clean up the model's output before it goes back to the browser.
import { BANK } from "../data/questions.js";

const byId = new Map(BANK.map((q) => [q.id, q]));
const stripTags = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export class InputError extends Error {}

// Field readers: trim, cap the length, and reject anything that isn't the expected type.
function str(v, max, { required = false, name = "field" } = {}) {
  if (v == null || v === "") { if (required) throw new InputError(`Missing ${name}.`); return ""; }
  if (typeof v !== "string" && typeof v !== "number") throw new InputError(`${name} must be text.`);
  const s = String(v).trim();
  if (required && !s) throw new InputError(`Missing ${name}.`);
  return s.slice(0, max);
}
const oneOf = (v, list, fallback) => (list.includes(v) ? v : fallback);
const strList = (v, n, max) => (Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, n).map((x) => x.trim().slice(0, max)) : []);
const outList = (v, n) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()).slice(0, n) : []);
const outStr = (v) => (typeof v === "string" ? v : "");

function student(p) {
  const m = p && typeof p === "object" ? p : {};
  return {
    name: str(m.name, 80) || "the student", year: str(m.year, 40) || "student", school: str(m.school, 120) || "their university",
    major: str(m.major, 120) || "their major", target: str(m.target, 200) || "an investment banking summer analyst role",
  };
}

const RULES = {
  tech: "Be strict but fair. Penalize wrong numbers, wrong signs or directions (for example cash going the wrong way), and missing key steps. Reward clear structure: headline first, then steps. Do not penalize a short answer that is correct and complete. Ignore spelling.",
  teaser: "Be strict but fair. Judge both the final answer and the reasoning shown. A correct answer with no reasoning should score no higher than 6. For estimates, reward a clear structure and reasonable stated assumptions; do not require an exact number. Penalize arithmetic mistakes.",
  fit: "Be strict but fair. Judge it as a real fit answer: specific, structured, believable, and tied to why banking. Penalize generic or rambling answers. The reference describes a good structure, not exact words.",
};
const sectionOf = (t) => (t === "Fit" ? "fit" : t === "Brain Teasers" ? "teaser" : "tech");
const NOTES_LABEL = {
  firm: "The candidate's own notes from networking with people at this firm (use them to judge whether the answer is specific and genuine)",
  resume: "The candidate's resume (judge whether the answer is specific and consistent with it)",
  resume_story: "The candidate's resume and the story they prepared (judge whether the answer is a clear, specific story consistent with the resume; it does not need to match the prepared text word for word)",
};
const ROLE_TITLES = { associate: "Associate", vp: "Vice President", md: "Managing Director" };

// Works out the question, topic and reference answer. A bank question's reference always comes from the server's copy.
function resolveQuestion(p) {
  const bank = p.qid ? byId.get(String(p.qid)) : null;
  const question = str(p.question, 600) || (bank ? bank.q : "");
  if (!question) throw new InputError("Missing question.");
  const topic = bank ? bank.t : str(p.topic, 40) || "Fit";
  const reference = bank ? stripTags(bank.a) : "None provided. Use your own expertise as an investment banker.";
  return { question, topic, reference };
}
function gradeOut(r, withFollowUp) {
  const score = Math.max(0, Math.min(10, Math.round(Number(r?.score) || 0)));
  const verdict = ["Strong", "Pass", "Borderline", "Fail"].includes(r?.verdict) ? r.verdict : score >= 8 ? "Pass" : score >= 5 ? "Borderline" : "Fail";
  const out = { score, verdict, strengths: outList(r?.strengths, 3), gaps: outList(r?.gaps, 3), model_answer: outStr(r?.model_answer) };
  if (withFollowUp) out.follow_up = outStr(r?.follow_up);
  return out;
}

export const FEATURES = {
  // Grade one mock-interview answer.
  grade: {
    pro: false, tier: "default", json: true,
    build(p) {
      const { question, topic, reference } = resolveQuestion(p);
      const answer = str(p.answer, 6000, { required: true, name: "answer" });
      const context = str(p.context, 600), notes = str(p.notes, 4500), sec = sectionOf(topic);
      const kind = sec === "fit" ? "fit (behavioral) interview" : sec === "teaser" ? "brain teaser and mental math round" : "technical interview";
      return `You are a senior investment banking associate running a ${kind} with an undergraduate candidate for a summer analyst role. Grade the candidate's answer the way a real interviewer would.

Question: ${question}
${context ? "Context from the earlier question: " + context + "\n" : ""}Reference answer (points the interviewer expects): ${reference}
${notes ? NOTES_LABEL[oneOf(p.notesKind, Object.keys(NOTES_LABEL), "firm")] + ": " + notes + "\n" : ""}
Candidate's answer:
"""${answer}"""

Grading rules: ${RULES[sec]}

Reply with JSON only, in this shape:
{"score": integer 0-10, "verdict": "Strong" | "Pass" | "Borderline" | "Fail", "strengths": [up to 3 short strings], "gaps": [up to 3 short strings, each naming what was wrong or missing], "model_answer": "a 60-120 word answer the candidate could say out loud", "follow_up": "one follow-up question this interviewer would ask next"}`;
    },
    clean: (r) => gradeOut(r, true),
  },

  // Grade one superday-simulation answer, in the voice of that round's interviewer.
  sim_grade: {
    pro: true, tier: "default", json: true,
    build(p) {
      const { question, topic, reference } = resolveQuestion(p);
      const answer = str(p.answer, 6000, { required: true, name: "answer" });
      const role = ROLE_TITLES[oneOf(p.role, Object.keys(ROLE_TITLES), "associate")], sec = sectionOf(topic);
      const kind = sec === "fit" ? "fit (behavioral)" : sec === "teaser" ? "brain teaser" : "technical";
      const firm = str(p.firm, 80), followOf = str(p.followOf, 600), prev = str(p.prevAnswer, 1500), notes = str(p.notes, 800), resume = str(p.resume, 2500);
      return `You are a ${role} at ${p.bank === "bb" ? "a bulge bracket investment bank" : "a middle-market investment bank"}${firm ? " (" + firm + ")" : ""}, interviewing an undergraduate at a superday for a summer analyst role. This is a ${kind} question. Grade the answer the way a real interviewer would.

Question: ${question}
${followOf ? `This was your follow-up to the earlier question: "${followOf}". The candidate's earlier answer: """${prev}"""\n` : ""}Reference answer (points the interviewer expects): ${reference}
${notes ? NOTES_LABEL.firm + ": " + notes + "\n" : ""}${resume ? "The candidate's resume (judge whether the answer is a clear, specific story consistent with it): " + resume + "\n" : ""}
Candidate's answer (typed the way they would say it):
"""${answer}"""

Grading rules: ${RULES[sec]}

Reply with JSON only, in this shape:
{"score": integer 0-10, "verdict": "Strong" | "Pass" | "Borderline" | "Fail", "strengths": [up to 2 short strings], "gaps": [up to 3 short strings, each naming what was wrong or missing], "model_answer": "a 60-120 word answer the candidate could say out loud"}`;
    },
    clean: (r) => gradeOut(r, false),
  },

  // One follow-up question from the interviewer, based on what the candidate just said.
  sim_followup: {
    pro: true, tier: "quick", json: false,
    build(p) {
      const role = ROLE_TITLES[oneOf(p.role, Object.keys(ROLE_TITLES), "associate")];
      const question = str(p.question, 600, { required: true, name: "question" }), answer = str(p.answer, 6000, { required: true, name: "answer" });
      return `You are a ${role} interviewing an undergraduate for an investment banking summer analyst role. You asked: "${question}". The candidate answered: """${answer}"""

Ask ONE short follow-up question that probes the weakest or most interesting part of their answer, the way a real interviewer would: ask them to go one step further, correct an error without saying what it is, or apply the idea to new numbers. Reply with the question only.`;
    },
    clean: (text) => ({ text: String(text || "").trim().replace(/^["'“]+|["'”]+$/g, "").slice(0, 400) }),
  },

  // The end-of-superday debrief.
  sim_debrief: {
    pro: true, tier: "default", json: true,
    build(p) {
      const lines = strList(p.lines, 30, 500);
      if (!lines.length) throw new InputError("Missing results.");
      const firm = str(p.firm, 80), overall = Math.max(0, Math.min(10, Number(p.overall) || 0));
      const verdict = oneOf(p.verdict, ["Would advance", "Borderline", "Not yet"], "Borderline");
      return `You are the managing director writing a short superday debrief for an undergraduate candidate interviewing for an investment banking summer analyst role${firm ? " at " + firm : ""}. Here is every question, its score and the gaps the interviewers noted:
${lines.map((l, i) => `${i + 1}. ${l}`).join("\n")}

Average score: ${overall.toFixed(1)}/10. Verdict: ${verdict}.

Write candid, specific feedback the candidate can act on this week. Reply with JSON only, in this shape:
{"headline": "one sentence the hiring committee would say about this candidate", "strengths": [2-3 short strings], "fixes": [3 short strings, most important first, each specific], "plan": [3 short, concrete study actions for the next week]}`;
    },
    clean: (r) => ({ headline: outStr(r?.headline), strengths: outList(r?.strengths, 3), fixes: outList(r?.fixes, 3), plan: outList(r?.plan, 3) }),
  },

  // A prep sheet for one networking call.
  call_prep: {
    pro: false, tier: "default", json: true,
    build(p) {
      const m = student(p.me), c = p.contact && typeof p.contact === "object" ? p.contact : {};
      const name = str(c.name, 80, { required: true, name: "contact name" }), firm = str(c.firm, 80, { required: true, name: "firm" });
      return `An undergraduate is preparing for a 15-20 minute networking call. Student: ${m.name}, a ${m.year} at ${m.school} studying ${m.major}, working toward ${m.target}. They come from a school without a big banking pipeline.
The person: ${name}, ${str(c.role, 120) || "role unknown"} at ${firm}. Connection: ${str(c.tie, 160) || "none noted"}. Stage so far: ${str(c.stage, 40) || "not contacted"}. Notes so far: ${str(c.notes, 2000) || "none"}.
Notes from the student's earlier calls with others at ${firm}: ${str(p.others, 800) || "none"}.

Write a call prep sheet. Pitch the questions at this person's seniority, build on the earlier notes where useful, and do not invent facts about the person, their deals or the firm.
Reply with JSON only, in this shape:
{"opener": "a 20-30 second intro the student can say", "questions": [5 specific, thoughtful questions], "avoid": [2 short things not to do on this call], "close": "one or two sentences to end the call and ask for a next step"}`;
    },
    clean: (r) => ({ opener: outStr(r?.opener), questions: outList(r?.questions, 6), avoid: outList(r?.avoid, 3), close: outStr(r?.close) }),
  },

  // A "Why this firm?" answer built only from the student's own notes.
  why_firm: {
    pro: false, tier: "default", json: true,
    build(p) {
      const m = student(p.me), firm = str(p.firm, 80, { required: true, name: "firm" }), group = str(p.group, 80);
      return `Help an undergraduate prepare their answer to "Why ${firm}?" for an investment banking ${group ? group + " " : ""}interview. Student: ${m.name}, a ${m.year} at ${m.school} studying ${m.major}, from a school without a big banking pipeline.

Use ONLY the facts below. Do not invent deals, people, offices or facts about the firm. Where something is missing, say so in "gaps".

People they've spoken with at ${firm}:
${str(p.people, 5000) || "none yet"}

What draws them to the firm, in their words: ${str(p.draw, 1200) || "not given"}
Deals or facts they know about the firm, in their words: ${str(p.deals, 1200) || "not given"}

Write an answer they can say out loud in 45-75 seconds: specific, warm and not generic. Mention one or two people by first name and what they said, and connect it to the student's own story.
Reply with JSON only, in this shape:
{"answer": "the spoken answer", "talking_points": [3 short strings], "ask_interviewer": [3 thoughtful questions to ask an interviewer at this firm, based on the notes], "gaps": [0-3 short strings on what would make the answer stronger]}`;
    },
    clean: (r) => ({ answer: outStr(r?.answer), talking_points: outList(r?.talking_points, 3), ask_interviewer: outList(r?.ask_interviewer, 3), gaps: outList(r?.gaps, 3) }),
  },

  // The "Walk me through your resume" story.
  story: {
    pro: false, tier: "default", json: true,
    build(p) {
      const m = student(p.me), resume = str(p.resume, 6000, { required: true, name: "resume" });
      const secs = oneOf(Number(p.seconds), [60, 90, 120], 90), words = Math.round((secs / 60) * 150);
      return `You are an investment banking recruiter coaching an undergraduate on the interview question "Walk me through your resume." The student is a ${m.year} at ${m.school}, a school without a big banking pipeline, working toward ${m.target}.

Their resume (pasted text, may be messy):
"""${resume}"""

Extra context from the student. Where they're from and why they chose their school: ${str(p.bg, 400) || "not given"}. How they got interested in finance: ${str(p.why, 400) || "not given"}.

Write a ${secs}-second spoken answer (about ${words} words) in the first person. Tell it as a story, not a list: 1) brief background, 2) what sparked their interest in finance, 3) two or three experiences from the resume and what each taught them, 4) why investment banking, now. Use ONLY facts from the resume and context. Never invent employers, numbers, titles or achievements. Where a part needs a fact you don't have, write a short placeholder in square brackets, like [one sentence on why you chose your school].

Reply with JSON only, in this shape:
{"story": "the full spoken answer", "beats": [{"label": "short name for this part", "cue": "a 3-6 word memory cue", "seconds": number}], "follow_ups": [6 specific questions an interviewer is likely to ask about items on this resume], "flags": [{"issue": "something on the resume an interviewer may probe, such as a gap, a short job, a low GPA, an unrelated major or a vague bullet", "framing": "one sentence on how to address it"}]}`;
    },
    clean: (r) => ({
      story: outStr(r?.story),
      beats: (Array.isArray(r?.beats) ? r.beats : []).filter((b) => b && b.label).slice(0, 7).map((b) => ({ label: String(b.label).slice(0, 60), cue: String(b.cue || "").slice(0, 80), seconds: Math.max(3, Math.min(120, Math.round(Number(b.seconds) || 10))) })),
      follow_ups: outList(r?.follow_ups, 8),
      flags: (Array.isArray(r?.flags) ? r.flags : []).filter((f) => f && f.issue).slice(0, 4).map((f) => ({ issue: String(f.issue).slice(0, 300), framing: String(f.framing || "").slice(0, 400) })),
    }),
  },
};

// Pulls a JSON object out of the model's reply, tolerating code fences or stray text around it.
export function parseJSON(text) {
  const t = String(text || "").replace(/^\s*```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try { return JSON.parse(t); } catch {}
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch {} }
  return null;
}
