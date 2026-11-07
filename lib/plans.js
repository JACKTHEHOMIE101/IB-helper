// What each plan includes. The app gates Pro features in the UI; the server enforces AI limits.
export function planLimits(env = process.env) {
  return {
    freePerWeek: Number(env.FREE_AI_PER_WEEK || 15), // AI calls per rolling 7 days on the free plan
    proPerDay: Number(env.PRO_AI_PER_DAY || 150),    // fair-use cap per day on Pro
  };
}

export const isPro = (user) => user?.plan === "pro";

// How many AI calls the user has left in their current window.
export async function aiAllowance(store, user, limits, now = new Date()) {
  if (isPro(user)) {
    const start = new Date(now); start.setUTCHours(0, 0, 0, 0);
    const used = await store.aiUsedSince(user.id, start);
    return { used, limit: limits.proPerDay, period: "day", remaining: Math.max(0, limits.proPerDay - used) };
  }
  const start = new Date(now.getTime() - 6 * 864e5); start.setUTCHours(0, 0, 0, 0);
  const used = await store.aiUsedSince(user.id, start);
  return { used, limit: limits.freePerWeek, period: "week", remaining: Math.max(0, limits.freePerWeek - used) };
}
