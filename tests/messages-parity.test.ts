import { describe, expect, it } from 'vitest';

import en from '@/messages/en.json';
import fr from '@/messages/fr.json';

/**
 * Every visible string goes through next-intl, and both message files must
 * stay at exact key parity (README › Project layout). This test turns that
 * rule into a check that runs in CI instead of a note humans have to
 * remember.
 */
const flatten = (obj: unknown, prefix = ''): string[] => {
  if (obj === null || typeof obj !== 'object') return [prefix.slice(0, -1)];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatten(v, `${prefix}${k}.`),
  );
};

describe('message files', () => {
  const frKeys = new Set(flatten(fr));
  const enKeys = new Set(flatten(en));

  it('fr.json and en.json have identical key sets', () => {
    const onlyFr = [...frKeys].filter((k) => !enKeys.has(k));
    const onlyEn = [...enKeys].filter((k) => !frKeys.has(k));
    expect({ onlyFr, onlyEn }).toEqual({ onlyFr: [], onlyEn: [] });
  });

  it('no message is empty', () => {
    const empties = (obj: unknown, prefix = ''): string[] => {
      if (typeof obj === 'string') return obj.trim() === '' ? [prefix] : [];
      if (obj === null || typeof obj !== 'object') return [];
      return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
        empties(v, `${prefix}${k}.`),
      );
    };
    expect(empties(fr)).toEqual([]);
    expect(empties(en)).toEqual([]);
  });

  it('ICU placeholders match between languages', () => {
    const placeholders = (s: string) => (s.match(/\{[a-zA-Z0-9_]+\}/g) ?? []).sort();
    const lookup = (obj: unknown, path: string) =>
      path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], obj);
    const mismatches: string[] = [];
    for (const key of frKeys) {
      const a = lookup(fr, key);
      const b = lookup(en, key);
      if (typeof a === 'string' && typeof b === 'string') {
        if (placeholders(a).join() !== placeholders(b).join()) mismatches.push(key);
      }
    }
    expect(mismatches).toEqual([]);
  });
});
