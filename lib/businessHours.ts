import { SITE, type OpeningHourBlock } from './site';

export type OpenStatus =
  | { state: 'open'; closesAt: string; nextLastOrder?: string }
  | { state: 'closed'; reopensAt?: string; reopensOn?: 'today' | 'next' };

/** "11:30" → 11 * 60 + 30. */
function toMinutes(hhmm: string): number {
  const parts = hhmm.split(':').map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  return h * 60 + m;
}

/**
 * Compute the current open/closed status for a given timestamp (default: now).
 *
 * Pure function. Safe to use during SSR; the caller is expected to recompute
 * client-side with the user's local clock if they want a live indicator.
 */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const dow = now.getDay();
  const cur = now.getHours() * 60 + now.getMinutes();

  const todayBlocks: OpeningHourBlock[] = SITE.hours.weekly[dow] ?? [];

  for (const b of todayBlocks) {
    const o = toMinutes(b.open);
    const c = toMinutes(b.close);
    if (cur >= o && cur < c) {
      return { state: 'open', closesAt: b.close, nextLastOrder: b.lastOrder };
    }
  }

  // Find next opening today.
  const upcomingToday = todayBlocks.find((b) => cur < toMinutes(b.open));
  if (upcomingToday) {
    return { state: 'closed', reopensAt: upcomingToday.open, reopensOn: 'today' };
  }

  // Look ahead up to 7 days for next opening.
  for (let i = 1; i <= 7; i += 1) {
    const d = (dow + i) % 7;
    const blocks = SITE.hours.weekly[d];
    const first = blocks?.[0];
    if (first) {
      return { state: 'closed', reopensAt: first.open, reopensOn: 'next' };
    }
  }
  return { state: 'closed' };
}
