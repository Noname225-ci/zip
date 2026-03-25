/**
 * validation.ts — Single source of truth for all input caps and sanitisation.
 * Every numeric input and text field in the app must go through these functions.
 * Changing a cap here changes it everywhere automatically.
 */

// ─── Hard numeric caps ───────────────────────────────────────────────────────

export const CAPS = {
  // Subscription calculator
  COST_MAX:          50_000,       // max monthly/yearly cost ($50k covers any enterprise plan)
  COST_MIN:          0.01,
  USAGE_MAX:         1_000,        // uses per month (>1000 uses/mo = multiple times an hour, every hour)
  USAGE_MIN:         0,
  REMINDER_DAYS_MAX: 90,
  REMINDER_DAYS_MIN: 1,

  // Runway calculator
  SAVINGS_MAX:       100_000_000,  // $100M — enough for any realistic personal finance scenario
  INCOME_MAX:        10_000_000,   // $10M/mo net
  EXPENSE_MAX:       1_000_000,    // $1M/mo per category (rent, food, etc.)
  DEBT_MAX:          10_000_000,   // $10M per debt category

  // Dashboard
  DASHBOARD_ITEMS_MAX: 50,         // max subscriptions tracked at once
  LOCALSTORAGE_MAX_BYTES: 200_000, // 200KB safety limit before refusing to write

  // Text
  SEARCH_MAX_LEN:    100,
  NAME_MAX_LEN:      120,
  CATEGORY_MAX_LEN:  60,
} as const;

// ─── Numeric sanitisers ──────────────────────────────────────────────────────

/** Parse a raw input string to a safe number within [min, max]. Returns null if blank. */
export function parseAndClamp(
  raw: string,
  min: number,
  max: number,
  allowZero = true
): number | null {
  if (raw === '' || raw === null || raw === undefined) return null;
  let n = parseFloat(raw);
  if (!isFinite(n) || isNaN(n)) return null;
  if (!allowZero && n === 0) return null;
  return Math.min(max, Math.max(min, n));
}

/** Clamp a number that's already parsed. */
export function clamp(n: number, min: number, max: number): number {
  if (!isFinite(n) || isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Called on onChange for numeric inputs — returns a clamped string or '' */
export function clampInput(raw: string, min: number, max: number): string {
  if (raw === '' || raw === '-') return '';
  const n = parseFloat(raw);
  if (isNaN(n) || !isFinite(n)) return '';
  // Don't clamp while typing (user may be mid-entry like "1." → "1.5")
  // but hard-block values that already exceed the cap
  if (n > max) return String(max);
  if (n < min) return String(min);
  return raw;
}

// ─── Text sanitisers ─────────────────────────────────────────────────────────

/** Strip HTML tags and control characters from any text field. */
export function sanitiseText(raw: string, maxLen: number): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/<[^>]*>/g, '')              // strip HTML tags
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '') // strip control chars (keep printable + unicode)
    .slice(0, maxLen)
    .trim();
}

// ─── LocalStorage size guard ─────────────────────────────────────────────────

/** Returns the approximate byte size of a serialised value. */
export function estimateBytes(value: unknown): number {
  try {
    return new Blob([JSON.stringify(value)]).size;
  } catch {
    return 0;
  }
}

/** True if writing `value` would stay under the safety limit. */
export function isSafeToStore(value: unknown): boolean {
  return estimateBytes(value) <= CAPS.LOCALSTORAGE_MAX_BYTES;
}

// ─── SubscriptionItem validator ──────────────────────────────────────────────

import type { SubscriptionItem } from '../context/SubscriptionContext';

export function validateSubscriptionItem(raw: unknown): SubscriptionItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const id       = sanitiseText(String(r.id ?? ''), 40);
  const name     = sanitiseText(String(r.name ?? ''), CAPS.NAME_MAX_LEN);
  const category = sanitiseText(String(r.category ?? ''), CAPS.CATEGORY_MAX_LEN);
  const freq     = r.frequency === 'yearly' ? 'yearly' : 'monthly';
  const verdict  = (['good', 'consider', 'wasted'] as const).includes(r.verdict as any)
    ? (r.verdict as 'good' | 'consider' | 'wasted')
    : 'consider';
  const cost     = clamp(parseFloat(String(r.cost ?? 0)) || 0, 0, CAPS.COST_MAX);
  const usage    = clamp(parseInt(String(r.usage ?? 0), 10) || 0, 0, CAPS.USAGE_MAX);

  if (!id || !name) return null;
  return { id, name, category, cost, frequency: freq, usage, verdict };
}
