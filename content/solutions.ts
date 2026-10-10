/**
 * Digital Station's own product solutions.
 *
 * Structure only — the name, tagline, description, tags and features live in
 * messages/<locale>.json under `solutions.items.<id>`, so the page works in
 * both languages.
 *
 * No prices and no visuals on purpose: every card sends the visitor to
 * /contact?product=<id> to ask for a demo.
 */

export type SolutionMeta = {
  id: string;
  /** Number of tag chips this solution defines in the message files. */
  tagCount: number;
  /** Number of feature bullets this solution defines in the message files. */
  featureCount: number;
};

export const SOLUTIONS: readonly SolutionMeta[] = [
  { id: 'digierp', tagCount: 3, featureCount: 4 },
  { id: 'digiresto', tagCount: 3, featureCount: 4 },
  { id: 'digistore', tagCount: 3, featureCount: 4 },
  { id: 'digicourrier', tagCount: 3, featureCount: 4 },
  { id: 'digischool', tagCount: 3, featureCount: 4 },
  { id: 'digichat', tagCount: 3, featureCount: 4 },
  { id: 'digiticket', tagCount: 3, featureCount: 4 },
  { id: 'digipost', tagCount: 3, featureCount: 4 },
] as const;

/** Cards shown per page on /solutions. */
export const SOLUTIONS_PER_PAGE = 3;
